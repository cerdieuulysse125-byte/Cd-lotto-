package com.cd.verite.lotto;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import android.util.Log;

public class MainActivity extends Activity {
    private WebView webView;
    private Object sunmiPrinter = null;
    private boolean connected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            webView = new WebView(this);
            setContentView(webView);
            WebSettings s = webView.getSettings();
            s.setJavaScriptEnabled(true);
            s.setDomStorageEnabled(true);
            s.setAllowFileAccess(true);
            s.setAllowFileAccessFromFileURLs(true);
            s.setAllowUniversalAccessFromFileURLs(true);

            initPrinter();
            PrinterBridge bridge = new PrinterBridge();
            webView.addJavascriptInterface(bridge, "AndroidPrinter");
            webView.addJavascriptInterface(bridge, "Android");

            webView.loadUrl("file:///android_asset/index.html");
        } catch (Exception e) {
            Log.e("APP", e.getMessage());
        }
    }

    private void initPrinter() {
        try {
            Class<?> man = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Class<?> cb = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback");
            Object callback = java.lang.reflect.Proxy.newProxyInstance(cb.getClassLoader(), new Class[]{cb},
                (p,m,a)->{
                    if("onConnected".equals(m.getName())){ sunmiPrinter=a[0]; connected=true; Log.d("SUNMI","CONNECTED"); }
                    if("onDisconnected".equals(m.getName())) connected=false;
                    return null;
                });
            Object mgr = man.getMethod("getInstance").invoke(null);
            man.getMethod("bindService", android.content.Context.class, cb).invoke(mgr, this, callback);
        } catch (Exception e){ connected=false; }
    }

    public class PrinterBridge {
        @JavascriptInterface public String getPrinterStatus(){ return connected?"CONNECTED":"DISCONNECTED"; }

        @JavascriptInterface
        public void printWithoutDialog(String text){
            try{
                if(sunmiPrinter==null) return;
                Class<?> c=sunmiPrinter.getClass();
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiPrinter,1,null);
                c.getMethod("printText", String.class, Object.class).invoke(sunmiPrinter,text,null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiPrinter,3,null);
            }catch(Exception e){}
        }

        @JavascriptInterface
        public void printLogo(String dataUrl){ printBitmap(dataUrl); }

        @JavascriptInterface
        public void printBitmap(String dataUrl){
            try{
                if(sunmiPrinter==null) return;
                String b64 = dataUrl.contains(",")?dataUrl.substring(dataUrl.indexOf(",")+1):dataUrl;
                if(b64.length()<100) return;
                byte[] d = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeByteArray(d,0,d.length);
                if(bmp==null) return;
                Class<?> c=sunmiPrinter.getClass();
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiPrinter,1,null);
                // redimensionne 200px max pou 58mm
                int w=200; int h=(int)(bmp.getHeight()*(w/(float)bmp.getWidth()));
                android.graphics.Bitmap small = android.graphics.Bitmap.createScaledBitmap(bmp,w,h,false);
                c.getMethod("printBitmap", android.graphics.Bitmap.class, Object.class).invoke(sunmiPrinter,small,null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiPrinter,1,null);
            }catch(Exception e){}
        }

        @JavascriptInterface public void printImage(String u){ printBitmap(u); }

        @JavascriptInterface
        public void printWithLogo(String logo, String text){
            try{
                if(logo!=null && logo.length()>200){ printBitmap(logo); Thread.sleep(600); }
                printWithoutDialog(text);
            }catch(Exception e){ printWithoutDialog(text); }
        }

        // Faux scan pou V26.5 pa crash
        @JavascriptInterface public String scanDevices(){ return "[{\"name\":\"Sunmi Interne\",\"mac\":\"SUNMI_INNER\",\"type\":\"sunmi\"}]"; }
        @JavascriptInterface public void selectPrinter(String mac){}
        @JavascriptInterface public void savePrinter(String mac,String name,String cfg){}
    }
}

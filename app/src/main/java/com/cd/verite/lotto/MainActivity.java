package com.cd.verite.lotto;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import android.util.Log;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

public class MainActivity extends Activity {
    private WebView webView;
    private Object sunmiService = null;
    private boolean isConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setAllowFileAccessFromFileURLs(true);

        initPrinter();

        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.addJavascriptInterface(new PrinterBridge(), "Android");

        webView.loadUrl("file:///android_asset/index.html");
    }

    private void initPrinter(){
        try{
            Class<?> managerClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Class<?> callbackClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback");
            Object callback = java.lang.reflect.Proxy.newProxyInstance(
                callbackClass.getClassLoader(),
                new Class[]{callbackClass},
                new java.lang.reflect.InvocationHandler(){
                    @Override
                    public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable {
                        String name = method.getName();
                        if("onConnected".equals(name)){
                            sunmiService = args[0];
                            isConnected = true;
                            Log.d("SUNMI","CONNECTED");
                        }
                        if("onDisconnected".equals(name)){
                            sunmiService = null;
                            isConnected = false;
                            Log.d("SUNMI","DISCONNECTED");
                        }
                        return null;
                    }
                }
            );
            Object mgr = managerClass.getMethod("getInstance").invoke(null);
            managerClass.getMethod("bindService", android.content.Context.class, callbackClass).invoke(mgr, this, callback);
        }catch(Exception e){
            Log.e("SUNMI","init err "+e.getMessage());
            isConnected = false;
        }
    }

    public class PrinterBridge {
        @JavascriptInterface public String getPrinterStatus(){ return isConnected ? "CONNECTED" : "DISCONNECTED"; }

        @JavascriptInterface public String scanDevices(){
            return "[{\"name\":\"Sunmi Interne\",\"mac\":\"SUNMI_INNER\",\"type\":\"sunmi\"}]";
        }
        @JavascriptInterface public void selectPrinter(String mac){}
        @JavascriptInterface public void savePrinter(String mac,String name,String cfg){}

        @JavascriptInterface
        public void printWithoutDialog(String text){
            try{
                if(sunmiService==null){ Log.e("PRINT","service null"); return; }
                Class<?> c = sunmiService.getClass();
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                c.getMethod("printText", String.class, Object.class).invoke(sunmiService, text, null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 4, null);
            }catch(Exception e){ Log.e("PRINT", e.toString()); }
        }

        @JavascriptInterface
        public void printLogo(String dataUrl){ printBitmap(dataUrl); }

        @JavascriptInterface
        public void printBitmap(String dataUrl){
            try{
                if(sunmiService==null) return;
                if(dataUrl==null || dataUrl.length()<100) return;
                String b64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",")+1) : dataUrl;
                byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
                Bitmap bmp = BitmapFactory.decodeByteArray(decoded,0,decoded.length);
                if(bmp==null) return;
                int w = 200;
                int h = (int)(bmp.getHeight() * (w / (float)bmp.getWidth()));
                Bitmap small = Bitmap.createScaledBitmap(bmp, w, h, false);
                Class<?> c = sunmiService.getClass();
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                c.getMethod("printBitmap", Bitmap.class, Object.class).invoke(sunmiService, small, null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 2, null);
            }catch(Exception e){ Log.e("PRINT_LOGO", e.toString()); }
        }

        @JavascriptInterface public void printImage(String u){ printBitmap(u); }

        @JavascriptInterface
        public void printWithLogo(String logo, String text){
            try{
                if(logo!=null && logo.length()>100){
                    printBitmap(logo);
                    try{ Thread.sleep(400); }catch(Exception ex){}
                }
                printWithoutDialog(text);
            }catch(Exception e){ printWithoutDialog(text); }
        }
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        try{
            Class<?> managerClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Class<?> callbackClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback");
            Object mgr = managerClass.getMethod("getInstance").invoke(null);
            // unbind to avoid leak
            try{
                managerClass.getMethod("unBindService", android.content.Context.class, callbackClass).invoke(mgr, this, null);
            }catch(Exception ex){}
        }catch(Exception e){}
    }
}

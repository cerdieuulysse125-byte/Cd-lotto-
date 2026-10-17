package com.cd.verite.lotto;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import android.util.Log;
import android.widget.Toast;

public class MainActivity extends Activity {

    private WebView webView;
    private Object sunmiPrinterService = null;
    private boolean sunmiConnected = false;

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
            
            initPrinter();
            
            webView.addJavascriptInterface(new PrinterBridge(), "Android");
            // Eseye 2 chemen pou evite crash
            webView.loadUrl("file:///android_asset/index.html");
            
        } catch (Exception e) {
            Log.e("APP", "Crash: " + e.getMessage());
            Toast.makeText(this, "Erè: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private void initPrinter() {
        try {
            Class<?> managerClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Class<?> callbackClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback");
            Object callback = java.lang.reflect.Proxy.newProxyInstance(
                callbackClass.getClassLoader(),
                new Class[]{callbackClass},
                (proxy, method, args) -> {
                    if ("onConnected".equals(method.getName())) {
                        sunmiPrinterService = args[0];
                        sunmiConnected = true;
                    } else if ("onDisconnected".equals(method.getName())) {
                        sunmiConnected = false;
                    }
                    return null;
                }
            );
            java.lang.reflect.Method getInstance = managerClass.getMethod("getInstance");
            Object manager = getInstance.invoke(null);
            java.lang.reflect.Method bind = managerClass.getMethod("bindService", android.content.Context.class, callbackClass);
            bind.invoke(manager, this, callback);
        } catch (Exception e) {
            sunmiConnected = false;
        }
    }

    public class PrinterBridge {
        @JavascriptInterface
        public void printWithoutDialog(String text) {
            try {
                if (sunmiPrinterService == null) return;
                Class<?> serviceClass = sunmiPrinterService.getClass();
                serviceClass.getMethod("printText", String.class, Object.class).invoke(sunmiPrinterService, text, null);
                serviceClass.getMethod("lineWrap", int.class, Object.class).invoke(sunmiPrinterService, 3, null);
            } catch (Exception e) {}
        }
        @JavascriptInterface
        public String getPrinterStatus() { return sunmiConnected ? "CONNECTED" : "DISCONNECTED"; }
        @JavascriptInterface
        public void printLogo(String dataUrl) {
            try {
                if (sunmiPrinterService == null) return;
                String b64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",")+1) : dataUrl;
                byte[] d = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeByteArray(d, 0, d.length);
                if (bmp != null) {
                    Class<?> c = sunmiPrinterService.getClass();
                    c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiPrinterService, 1, null);
                    c.getMethod("printBitmap", android.graphics.Bitmap.class, Object.class).invoke(sunmiPrinterService, bmp, null);
                    c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiPrinterService, 2, null);
                }
            } catch (Exception e) {}
        }
        @JavascriptInterface public void printBitmap(String d){ printLogo(d); }
        @JavascriptInterface
        public void printWithLogo(String logo, String text){
            if(logo!=null && logo.length()>100){ printLogo(logo); try{Thread.sleep(600);}catch(Exception ex){} }
            printWithoutDialog(text);
        }
    }
}

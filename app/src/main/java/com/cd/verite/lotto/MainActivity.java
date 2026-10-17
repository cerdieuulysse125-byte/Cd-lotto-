package com.cd.verite.lotto;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private Object sunmiPrinterService = null;
    private boolean sunmiConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Pa bezwen R.layout - sa ki fè nou te VÈT
        webView = new WebView(this);
        setContentView(webView);
        
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        
        initPrinter();
        
        webView.addJavascriptInterface(new PrinterBridge(), "Android");
        webView.loadUrl("file:///android_asset/index.html");
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
                        Log.d("SUNMI", "Connected");
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
            Log.e("SUNMI", "Init error: " + e.getMessage());
            sunmiConnected = false;
        }
    }

    public class PrinterBridge {

        @JavascriptInterface
        public void printWithoutDialog(String text) {
            try {
                if (sunmiPrinterService == null) {
                    Log.d("PRINTER", "Service null, log only: " + text);
                    return;
                }
                Class<?> serviceClass = sunmiPrinterService.getClass();
                java.lang.reflect.Method printText = serviceClass.getMethod("printText", String.class, Object.class);
                printText.invoke(sunmiPrinterService, text, null);
                java.lang.reflect.Method lineWrap = serviceClass.getMethod("lineWrap", int.class, Object.class);
                lineWrap.invoke(sunmiPrinterService, 3, null);
            } catch (Exception e) {
                Log.e("PRINT", "Error: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public String getPrinterStatus() {
            return sunmiConnected ? "CONNECTED" : "DISCONNECTED";
        }

        @JavascriptInterface
        public void printLogo(String dataUrl) {
            try {
                if (sunmiPrinterService == null) {
                    Log.d("LOGO", "Service null");
                    return;
                }
                String b64 = dataUrl;
                if (b64.contains(",")) b64 = b64.substring(b64.indexOf(",") + 1);
                byte[] d = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeByteArray(d, 0, d.length);
                if (bmp != null) {
                    Class<?> serviceClass = sunmiPrinterService.getClass();
                    java.lang.reflect.Method setAlign = serviceClass.getMethod("setAlignment", int.class, Object.class);
                    setAlign.invoke(sunmiPrinterService, 1, null); // Center
                    java.lang.reflect.Method printBmp = serviceClass.getMethod("printBitmap", android.graphics.Bitmap.class, Object.class);
                    printBmp.invoke(sunmiPrinterService, bmp, null);
                    java.lang.reflect.Method lineWrap = serviceClass.getMethod("lineWrap", int.class, Object.class);
                    lineWrap.invoke(sunmiPrinterService, 2, null);
                    Log.d("LOGO", "Printed logo");
                }
            } catch (Exception e) {
                Log.e("LOGO", "Error: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void printBitmap(String dataUrl) {
            printLogo(dataUrl);
        }

        @JavascriptInterface
        public void printWithLogo(String logoDataUrl, String text) {
            try {
                if (logoDataUrl != null && logoDataUrl.length() > 100) {
                    printLogo(logoDataUrl);
                    try { Thread.sleep(700); } catch (Exception ex) {}
                }
                printWithoutDialog(text);
            } catch (Exception e) {
                printWithoutDialog(text);
            }
        }
    }
}

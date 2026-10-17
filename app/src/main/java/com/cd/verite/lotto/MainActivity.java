package com.cd.verite.lotto;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private Object sunmiPrinterService = null;
    private boolean sunmiConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        // Lyen ak printer Sunmi
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
                java.lang.reflect.Method printText = sunmiPrinterService.getClass().getMethod("printText", String.class, Object.class);
                printText.invoke(sunmiPrinterService, text, null);
                java.lang.reflect.Method lineWrap = sunmiPrinterService.getClass().getMethod("lineWrap", int.class, Object.class);
                lineWrap.invoke(sunmiPrinterService, 3, null);
            } catch (Exception e) {}
        }

        @JavascriptInterface
        public String getPrinterStatus() {
            return sunmiConnected ? "CONNECTED" : "DISCONNECTED";
        }

        @JavascriptInterface
        public void printLogo(String dataUrl) {
            try {
                if (sunmiPrinterService == null) return;
                String b64 = dataUrl;
                if (b64.contains(",")) b64 = b64.substring(b64.indexOf(",") + 1);
                byte[] d = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeByteArray(d, 0, d.length);
                if (bmp != null) {
                    java.lang.reflect.Method setAlign = sunmiPrinterService.getClass().getMethod("setAlignment", int.class, Object.class);
                    setAlign.invoke(sunmiPrinterService, 1, null);
                    java.lang.reflect.Method printBmp = sunmiPrinterService.getClass().getMethod("printBitmap", android.graphics.Bitmap.class, Object.class);
                    printBmp.invoke(sunmiPrinterService, bmp, null);
                    java.lang.reflect.Method lineWrap = sunmiPrinterService.getClass().getMethod("lineWrap", int.class, Object.class);
                    lineWrap.invoke(sunmiPrinterService, 2, null);
                }
            } catch (Exception e) {}
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
                    try { Thread.sleep(600); } catch (Exception ex) {}
                }
                printWithoutDialog(text);
            } catch (Exception e) {
                printWithoutDialog(text);
            }
        }
    }
}

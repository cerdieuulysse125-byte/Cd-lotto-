package com.cdverite.lotto;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import woyou.aidlservice.jiuiv5.IWoyouService;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private IWoyouService sunmiPrinterService;
    private boolean sunmiConnected = false;

    private ServiceConnection sunmiConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            sunmiPrinterService = IWoyouService.Stub.asInterface(service);
            sunmiConnected = true;
        }
        @Override
        public void onServiceDisconnected(ComponentName name) {
            sunmiPrinterService = null;
            sunmiConnected = false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
        
        setContentView(webView);
        
        initSunmiPrinter();
    }

    private void initSunmiPrinter(){
        try{
            Intent intent = new Intent();
            intent.setPackage("woyou.aidlservice.jiuiv5");
            intent.setAction("woyou.aidlservice.jiuiv5.IWoyouService");
            bindService(intent, sunmiConnection, Context.BIND_AUTO_CREATE);
        }catch(Exception e){}
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try{ unbindService(sunmiConnection); }catch(Exception e){}
    }

    public class PrinterBridge {

        private Bitmap decodeBase64(String dataUrl){
            try{
                String base64 = dataUrl;
                if(base64 == null) return null;
                if(base64.contains(",")){
                    base64 = base64.substring(base64.indexOf(",")+1);
                }
                base64 = base64.trim();
                if(base64.length() < 50) return null;
                byte[] decoded = Base64.decode(base64, Base64.DEFAULT);
                if(decoded.length == 0) return null;
                return BitmapFactory.decodeByteArray(decoded, 0, decoded.length);
            }catch(Exception e){
                return null;
            }
        }

        // ===== Recherche Aparèy =====
        @JavascriptInterface
        public String scanDevices(){
            // Sunmi V2 Pro gen enprimant entèn sèlman
            try{
                org.json.JSONArray arr = new org.json.JSONArray();
                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("mac", "SUNMI_INNER");
                obj.put("name", "Sunmi Inner Printer");
                obj.put("type", "INNER");
                arr.put(obj);
                return arr.toString();
            }catch(Exception e){
                return "[{\"mac\":\"SUNMI_INNER\",\"name\":\"Sunmi Inner Printer\",\"type\":\"INNER\"}]";
            }
        }

        @JavascriptInterface
        public void selectPrinter(String mac){
            // Sunmi pa bezwen seleksyon
        }

        @JavascriptInterface
        public void savePrinter(String mac, String name, String cfg){
            try{
                getSharedPreferences("printer", MODE_PRIVATE).edit()
                    .putString("mac", mac)
                    .putString("name", name)
                    .putString("cfg", cfg)
                    .apply();
            }catch(Exception e){}
        }

        // ===== LOGO PRINT - SA KI TE MANKE A =====
        @JavascriptInterface
        public void printLogo(String dataUrl){
            try{
                Bitmap bmp = decodeBase64(dataUrl);
                if(bmp == null) return;
                Bitmap scaled = Bitmap.createScaledBitmap(bmp, 200, 200, true);
                if(sunmiPrinterService != null){
                    sunmiPrinterService.setAlignment(1, null);
                    sunmiPrinterService.printBitmap(scaled, null);
                    sunmiPrinterService.lineWrap(1, null);
                }
            }catch(Exception e){}
        }

        @JavascriptInterface
        public void printBitmap(String dataUrl){
            printLogo(dataUrl);
        }

        @JavascriptInterface
        public void printImage(String dataUrl){
            printLogo(dataUrl);
        }

        @JavascriptInterface
        public void printWithLogo(String dataUrl, String text){
            try{
                if(sunmiPrinterService != null){
                    // 1 - Enprime Logo santre 20mm
                    sunmiPrinterService.setAlignment(1, null);
                    Bitmap bmp = decodeBase64(dataUrl);
                    if(bmp != null){
                        Bitmap scaled = Bitmap.createScaledBitmap(bmp, 200, 200, true);
                        sunmiPrinterService.printBitmap(scaled, null);
                        sunmiPrinterService.lineWrap(2, null);
                    }
                    // 2 - Enprime Tèks santre (C&D VERITE LOTTO santre menm jan ak lòt yo)
                    sunmiPrinterService.setAlignment(1, null);
                    sunmiPrinterService.setFontSize(24, null);
                    if(text != null){
                        sunmiPrinterService.printOriginalText(text + "\n\n\n\n", null);
                    }
                    sunmiPrinterService.cutPaper(null);
                } else {
                    // Fallback si Sunmi pa konekte
                    printWithoutDialog(text);
                }
            }catch(Exception e){
                try{ printWithoutDialog(text); }catch(Exception ex){}
            }
        }

        @JavascriptInterface
        public void printWithoutDialog(String text){
            try{
                if(sunmiPrinterService != null){
                    sunmiPrinterService.setAlignment(1, null);
                    sunmiPrinterService.setFontSize(24, null);
                    if(text != null){
                        // ESC \x1B\x61\x01 deja voye soti nan JS pou santre
                        String clean = text.replace("\u001B", "").replace("a\u0001", "").replace("a\u0000", "");
                        // Si tèks la gen ESC, kite l, sinon santre tout
                        sunmiPrinterService.printOriginalText(text + "\n\n\n\n", null);
                    }
                    sunmiPrinterService.cutPaper(null);
                }
            }catch(Exception e){}
        }

        @JavascriptInterface
        public void printText(String text){
            printWithoutDialog(text);
        }

        @JavascriptInterface
        public String getPrinterStatus(){
            return sunmiConnected ? "CONNECTED" : "DISCONNECTED";
        }
    }
}

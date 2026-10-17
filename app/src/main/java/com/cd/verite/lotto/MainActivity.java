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

import com.sunmi.peripheral.printer.InnerPrinterCallback;
import com.sunmi.peripheral.printer.InnerPrinterException;
import com.sunmi.peripheral.printer.InnerPrinterManager;
import com.sunmi.peripheral.printer.SunmiPrinterService;

public class MainActivity extends Activity {
    private WebView webView;
    private SunmiPrinterService sunmiPrinterService = null;
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

        initSunmiPrinter();

        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.addJavascriptInterface(new PrinterBridge(), "Android");

        webView.loadUrl("file:///android_asset/index.html");
    }

    private void initSunmiPrinter(){
        try{
            InnerPrinterManager.getInstance().bindService(this, innerPrinterCallback);
        }catch(Exception e){ Log.e("SUNMI","bind err "+e.getMessage()); }
    }

    private InnerPrinterCallback innerPrinterCallback = new InnerPrinterCallback(){
        @Override
        protected void onConnected(SunmiPrinterService service){
            sunmiPrinterService = service;
            isConnected = true;
            Log.d("SUNMI","CONNECTED");
            try{
                if(sunmiPrinterService!=null){
                    sunmiPrinterService.updatePrinterState();
                }
            }catch(Exception e){}
        }
        @Override
        protected void onDisconnected(){
            sunmiPrinterService = null;
            isConnected = false;
            Log.d("SUNMI","DISCONNECTED");
        }
    };

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
                if(sunmiPrinterService==null){ Log.e("PRINT","service null"); return; }
                sunmiPrinterService.setAlignment(1, null);
                sunmiPrinterService.printText(text, null);
                sunmiPrinterService.lineWrap(4, null);
            }catch(Exception e){ Log.e("PRINT","err "+e.getMessage()); }
        }

        @JavascriptInterface
        public void printLogo(String dataUrl){ printBitmap(dataUrl); }

        @JavascriptInterface
        public void printBitmap(String dataUrl){
            try{
                if(sunmiPrinterService==null) return;
                if(dataUrl==null||dataUrl.length()<100) return;
                String b64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",")+1) : dataUrl;
                byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
                Bitmap bmp = BitmapFactory.decodeByteArray(decoded,0,decoded.length);
                if(bmp==null) return;
                // Redimansyone 200px pou 58mm SANTRE
                int w = 200;
                int h = (int)(bmp.getHeight() * (w / (float)bmp.getWidth()));
                Bitmap small = Bitmap.createScaledBitmap(bmp, w, h, false);
                sunmiPrinterService.setAlignment(1, null);
                sunmiPrinterService.printBitmap(small, null);
                sunmiPrinterService.lineWrap(1, null);
            }catch(Exception e){ Log.e("PRINT_LOGO",e.getMessage()); }
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
        try{ InnerPrinterManager.getInstance().unBindService(this, innerPrinterCallback); }catch(Exception e){}
    }
}

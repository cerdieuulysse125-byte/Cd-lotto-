package com.cdlotto.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import android.content.ComponentName;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import woyou.aidlservice.jiuiv5.IWoyouService;

public class MainActivity extends Activity {
    private WebView webView;
    private IWoyouService sunmiService;
    private boolean isBound = false;

    private ServiceConnection conn = new ServiceConnection() {
        public void onServiceConnected(ComponentName name, IBinder service) {
            sunmiService = IWoyouService.Stub.asInterface(service);
            isBound = true;
            Log.d("C&D","Sunmi Bound OK");
        }
        public void onServiceDisconnected(ComponentName name) {
            sunmiService = null;
            isBound = false;
        }
    };

    public class SunmiPrinter {
        @JavascriptInterface
        public void printText(String text) {
            try {
                if(sunmiService != null) {
                    sunmiService.printerInit(null);
                    sunmiService.setAlignment(1, null);
                    sunmiService.printOriginalText(text + "\n\n\n", null);
                    sunmiService.lineWrap(3, null);
                    sunmiService.cutPaper(null);
                }
            } catch (Exception e) {
                Log.e("C&D","Print fail "+e.getMessage());
            }
        }
        @JavascriptInterface
        public void cutPaper() {
            try { if(sunmiService!=null) sunmiService.cutPaper(null); } catch(Exception e){}
        }
        @JavascriptInterface
        public boolean isReady() { return isBound; }
    }

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
        
        webView.addJavascriptInterface(new SunmiPrinter(), "SunmiPrinter");
        webView.addJavascriptInterface(new SunmiPrinter(), "sunmiInnerPrinter");
        
        // Chaje sit ou a - V25.7 FIX
        webView.loadUrl("https://cerdieuulysse125-byte.github.io/vendeur.html");
        
        // Bind Sunmi Service
        try {
            android.content.Intent intent = new android.content.Intent();
            intent.setPackage("woyou.aidlservice.jiuiv5");
            intent.setAction("woyou.aidlservice.jiuiv5.IWoyouService");
            bindService(intent, conn, BIND_AUTO_CREATE);
        } catch(Exception e){ Log.e("C&D","Bind fail"); }
    }
}>

package com.cdlotto.app;
import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        LinearLayout main = new LinearLayout(this);
        main.setOrientation(LinearLayout.VERTICAL);
        main.setBackgroundColor(Color.WHITE);
        
        TextView status = new TextView(this);
        status.setText("CD LOTTO AP CHAJE... V33");
        status.setBackgroundColor(Color.BLACK);
        status.setTextColor(Color.YELLOW);
        status.setPadding(20,20,20,20);
        main.addView(status, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        
        WebView w = new WebView(this);
        LinearLayout.LayoutParams wp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f);
        main.addView(w, wp);
        
        Button btn = new Button(this);
        btn.setText("SOTI NET - FEMEN");
        btn.setBackgroundColor(Color.RED);
        btn.setTextColor(Color.WHITE);
        btn.setTextSize(20);
        main.addView(btn, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 200));
        btn.setOnClickListener(v -> { finishAffinity(); System.exit(0); });
        
        setContentView(main);
        
        try {
            WebSettings s = w.getSettings();
            s.setJavaScriptEnabled(true);
            s.setDomStorageEnabled(true);
            s.setAllowFileAccess(true);
            s.setAllowUniversalAccessFromFileURLs(true);
            s.setAllowFileAccessFromFileURLs(true);
            s.setCacheMode(WebSettings.LOAD_NO_CACHE);
            w.setWebViewClient(new WebViewClient() {
                public void onReceivedError(WebView view, int code, String desc, String url) {
                    status.setText("ERÈ: " + desc + " - " + url);
                }
            });
            w.loadUrl("file:///android_asset/index.html");
            status.setText("AP CHAJE: file:///android_asset/index.html - V33");
        } catch (Exception e) {
            status.setText("ERÈ JAVA: " + e.getMessage());
        }
    }
}

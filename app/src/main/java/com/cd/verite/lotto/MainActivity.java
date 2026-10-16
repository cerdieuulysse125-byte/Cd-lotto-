package com.cd.verite.lotto;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.widget.Toast;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            WebView webView = new WebView(this);
            setContentView(webView);
            
            WebSettings s = webView.getSettings();
            s.setJavaScriptEnabled(true);
            s.setDomStorageEnabled(true);
            s.setAllowFileAccessFromFileURLs(true);
            s.setAllowUniversalAccessFromFileURLs(true);
            
            webView.setWebViewClient(new WebViewClient(){
                public void onReceivedError(WebView view, int code, String desc, String url){
                    Toast.makeText(MainActivity.this, "Erè: "+desc, Toast.LENGTH_LONG).show();
                }
            });
            
            webView.loadUrl("file:///android_asset/index.html");
            
        } catch (Exception e) {
            Toast.makeText(this, "ERÈ: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }
}

package com.cd.verite.lotto;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.webview);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        webView.addJavascriptInterface(new PrinterBridge(), "Android");
        webView.loadUrl("file:///android_asset/index.html");
    }

    public class PrinterBridge {

        @JavascriptInterface
        public void printWithoutDialog(String text) {
            android.util.Log.d("PRINTER", text);
        }

        @JavascriptInterface
        public String getPrinterStatus() {
            return "CONNECTED";
        }

        @JavascriptInterface
        public void printLogo(String dataUrl) {
            try {
                String b64 = dataUrl;
                if (b64.contains(",")) b64 = b64.substring(b64.indexOf(",") + 1);
                byte[] d = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeByteArray(d, 0, d.length);
                android.util.Log.d("LOGO", "Logo decoded: " + (bmp != null ? bmp.getWidth() : "null"));
            } catch (Exception e) {}
        }

        @JavascriptInterface
        public void printBitmap(String dataUrl) {
            printLogo(dataUrl);
        }

        @JavascriptInterface
        public void printWithLogo(String logoDataUrl, String text) {
            printLogo(logoDataUrl);
            printWithoutDialog(text);
        }
    }
}

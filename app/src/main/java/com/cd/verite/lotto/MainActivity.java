package com.cd.verite.lotto;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import android.print.PrintManager;
import android.content.Context;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
public class MainActivity extends AppCompatActivity {
    WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        webView.addJavascriptInterface(new PrinterInterface(this), "AndroidPrinter");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }
    public class PrinterInterface {
        Context ctx;
        PrinterInterface(Context c){ctx=c;}
        @JavascriptInterface
        public void printDirect(){
            runOnUiThread(()->{
                PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                pm.print("CD-Lotto", webView.createPrintDocumentAdapter("CD-Lotto"), null);
                Toast.makeText(ctx, "📤 Enprime san dyalòg...", Toast.LENGTH_SHORT).show();
            });
        }
        @JavascriptInterface
        public void printTicket(String text){
            runOnUiThread(()->{
                PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                pm.print("Ticket", webView.createPrintDocumentAdapter(), null);
                Toast.makeText(ctx, "🖨️ "+text, Toast.LENGTH_SHORT).show();
            });
        }
        @JavascriptInterface
        public void showToast(String msg){
            runOnUiThread(()-> Toast.makeText(ctx, msg, Toast.LENGTH_SHORT).show());
        }
    }
}

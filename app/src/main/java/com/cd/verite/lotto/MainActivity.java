package com.cdverite.lotto;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.sunmi.printerhelper.PrinterHelper;
import woyou.aidlservice.jiuiv5.IWoyouService;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private IWoyouService sunmiPrinterService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
        setContentView(webView);
        initSunmi();
    }

    private void initSunmi(){
        try{
            PrinterHelper.getInstance().initSunmiPrinterService(this, new PrinterHelper.PrinterCallback(){
                public void onConnected(IWoyouService service){ sunmiPrinterService = service; }
                public void onDisconnected(){}
            });
        }catch(Exception e){}
    }

    public class PrinterBridge {
        @JavascriptInterface
        public String scanDevices(){ return "[]"; }

        @JavascriptInterface
        public void selectPrinter(String mac){}

        @JavascriptInterface
        public void savePrinter(String mac, String name, String cfg){
            getSharedPreferences("printer", MODE_PRIVATE).edit().putString("cfg", cfg).apply();
        }

        private Bitmap decodeBase64(String dataUrl){
            try{
                String base64 = dataUrl;
                if(base64.contains(",")) base64 = base64.substring(base64.indexOf(",")+1);
                byte[] decoded = Base64.decode(base64, Base64.DEFAULT);
                return BitmapFactory.decodeByteArray(decoded,0,decoded.length);
            }catch(Exception e){ return null; }
        }

        @JavascriptInterface
        public void printLogo(String dataUrl){
            try{
                Bitmap bmp = decodeBase64(dataUrl);
                if(bmp==null) return;
                Bitmap scaled = Bitmap.createScaledBitmap(bmp, 200, 200, true);
                if(sunmiPrinterService!=null){
                    sunmiPrinterService.setAlignment(1,null);
                    sunmiPrinterService.printBitmap(scaled,null);
                    sunmiPrinterService.lineWrap(1,null);
                }
            }catch(Exception e){}
        }

        @JavascriptInterface
        public void printBitmap(String dataUrl){
            printLogo(dataUrl);
        }

        @JavascriptInterface
        public void printWithLogo(String dataUrl, String text){
            try{
                if(sunmiPrinterService!=null){
                    sunmiPrinterService.setAlignment(1,null);
                    Bitmap bmp = decodeBase64(dataUrl);
                    if(bmp!=null){
                        Bitmap scaled = Bitmap.createScaledBitmap(bmp, 200, 200, true);
                        sunmiPrinterService.printBitmap(scaled,null);
                        sunmiPrinterService.lineWrap(1,null);
                    }
                    sunmiPrinterService.setAlignment(1,null);
                    sunmiPrinterService.printOriginalText(text+"\n\n\n\n",null);
                    sunmiPrinterService.cutPaper(null);
                }
            }catch(Exception e){
                printWithoutDialog(text);
            }
        }

        @JavascriptInterface
        public void printWithoutDialog(String text){
            try{
                if(sunmiPrinterService!=null){
                    sunmiPrinterService.setAlignment(1,null);
                    sunmiPrinterService.printOriginalText(text+"\n\n\n\n",null);
                    sunmiPrinterService.cutPaper(null);
                }
            }catch(Exception e){}
        }
    }
}

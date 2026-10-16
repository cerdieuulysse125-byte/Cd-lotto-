package com.cd.verite.lotto;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.JavascriptInterface;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.widget.Toast;
import android.Manifest;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Set;

public class MainActivity extends Activity {
    WebView webView; BluetoothAdapter btAdapter;
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // OTORIZASYON OTOMATIK
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.S){
            requestPermissions(new String[]{Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH, Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        } else {
            requestPermissions(new String[]{Manifest.permission.BLUETOOTH, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
        }
        WebView w = new WebView(this); setContentView(w); this.webView=w;
        WebSettings s=w.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setAllowFileAccess(true); s.setAllowFileAccessFromFileURLs(true); s.setAllowUniversalAccessFromFileURLs(true); s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        w.addJavascriptInterface(new PrinterInterface(this), "AndroidPrinter");
        w.setWebViewClient(new WebViewClient(){ 
            public void onPageFinished(WebView view, String url){ 
                view.evaluateJavascript("if(document.getElementById('splash')){document.getElementById('splash').style.display='none';}", null); 
            } 
        });
        w.loadUrl("file:///android_asset/index.html"); btAdapter=BluetoothAdapter.getDefaultAdapter();
    }
    public class PrinterInterface {
        Context ctx; PrinterInterface(Context c){ctx=c;}
        @JavascriptInterface public String scanDevices() {
            try { JSONArray arr=new JSONArray();
                if(btAdapter!=null){ try{ Set<BluetoothDevice> paired=btAdapter.getBondedDevices(); for(BluetoothDevice d:paired){ JSONObject o=new JSONObject(); o.put("name", d.getName()!=null?d.getName():"Unknown"); o.put("mac", d.getAddress()); o.put("type","Bluetooth"); arr.put(o);} }catch(Exception e){} }
                JSONObject sunmi=new JSONObject(); sunmi.put("name","Sunmi V2 Pro - Entèn"); sunmi.put("mac","SUNMI_INNER"); sunmi.put("type","Sunmi"); arr.put(sunmi); return arr.toString();
            } catch(Exception e){ return "[]"; }
        }
        @JavascriptInterface public void printWithoutDialog(String text) {
            try{ android.content.Intent b=new android.content.Intent(); b.setAction("com.sunmi.print.action.PRINT_TEXT"); b.putExtra("print_text", text); ctx.sendBroadcast(b); }catch(Exception e){}
            runOnUiThread(()->Toast.makeText(ctx,"🖨️ SAN DYALOG voye!",Toast.LENGTH_SHORT).show());
        }
        @JavascriptInterface public void showToast(String msg){ runOnUiThread(()->Toast.makeText(ctx,msg,Toast.LENGTH_SHORT).show()); }
    }
}

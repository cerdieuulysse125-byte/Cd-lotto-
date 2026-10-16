package com.cd.verite.lotto;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.widget.Toast;
import android.Manifest;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Set;
import java.util.UUID;
import java.io.OutputStream;

public class MainActivity extends Activity {
    WebView webView; BluetoothAdapter btAdapter; String selectedMac = "";
    String selectedName = "";
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.S){
            requestPermissions(new String[]{Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH, Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        } else {
            requestPermissions(new String[]{Manifest.permission.BLUETOOTH, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        }
        WebView w = new WebView(this); setContentView(w); this.webView=w;
        WebSettings s=w.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setAllowFileAccess(true); s.setAllowFileAccessFromFileURLs(true); s.setAllowUniversalAccessFromFileURLs(true); s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        w.addJavascriptInterface(new PrinterInterface(this), "AndroidPrinter");
        w.setWebViewClient(new WebViewClient(){ 
            public void onPageFinished(WebView view, String url){ 
                view.evaluateJavascript("if(document.getElementById('splash')){document.getElementById('splash').style.display='none';} if(localStorage.getItem('selectedPrinterMac')){try{AndroidPrinter.selectPrinter(localStorage.getItem('selectedPrinterMac')); }catch(e){}}", null); 
            } 
        });
        w.loadUrl("file:///android_asset/index.html"); btAdapter=BluetoothAdapter.getDefaultAdapter();
    }
    public class PrinterInterface {
        Context ctx; PrinterInterface(Context c){ctx=c;}
        @JavascriptInterface public String scanDevices() {
            try { JSONArray arr=new JSONArray();
                if(btAdapter!=null){ try{ Set<BluetoothDevice> paired=btAdapter.getBondedDevices(); for(BluetoothDevice d:paired){ JSONObject o=new JSONObject(); o.put("name", d.getName()!=null?d.getName():"Unknown"); o.put("mac", d.getAddress()); o.put("type","Bluetooth"); arr.put(o);} }catch(Exception e){} }
                JSONObject sunmi=new JSONObject(); sunmi.put("name","Sunmi V2 Pro - Entèn (58mm)"); sunmi.put("mac","SUNMI_INNER"); sunmi.put("type","Sunmi - Otomatik SAN DYALOG"); arr.put(sunmi);
                JSONObject inner=new JSONObject(); inner.put("name","InnerPrinter - Sunmi"); inner.put("mac","INNER"); inner.put("type","Sunmi"); arr.put(inner);
                return arr.toString();
            } catch(Exception e){ return "[]"; }
        }
        @JavascriptInterface public void selectPrinter(String mac){
            selectedMac=mac;
            if(mac.contains("SUNMI") || mac.equals("INNER")) selectedName="Sunmi V2 Pro";
            runOnUiThread(()->Toast.makeText(ctx,"✅ Konfigire: "+mac+" - SAN DYALOG pare",Toast.LENGTH_SHORT).show());
        }
        @JavascriptInterface public void savePrinter(String mac, String name, String configJson){
            selectedMac=mac; selectedName=name;
            ctx.getSharedPreferences("printer", MODE_PRIVATE).edit().putString("mac", mac).putString("name", name).putString("config", configJson).apply();
            runOnUiThread(()->Toast.makeText(ctx,"💾 Anrejistre: "+name+" - Nenpòt machin ap enprime SAN DYALOG",Toast.LENGTH_LONG).show());
        }
        @JavascriptInterface public void printWithoutDialog(String text) {
            String macToUse = selectedMac;
            if(macToUse.isEmpty()){
                macToUse = ctx.getSharedPreferences("printer", MODE_PRIVATE).getString("mac", "SUNMI_INNER");
            }
            String finalMac = macToUse;
            try{
                if(finalMac.equals("SUNMI_INNER") || finalMac.equals("INNER") || finalMac.contains("SUNMI")){
                    android.content.Intent b=new android.content.Intent(); b.setAction("com.sunmi.print.action.PRINT_TEXT"); b.putExtra("print_text", text); ctx.sendBroadcast(b);
                } else {
                    new Thread(()->{
                        try{
                            BluetoothDevice dev=btAdapter.getRemoteDevice(finalMac);
                            UUID uuid=UUID.fromString("00001101-0000-1000-8000-00805f9B34FB");
                            BluetoothSocket sock=dev.createRfcommSocketToServiceRecord(uuid);
                            btAdapter.cancelDiscovery(); sock.connect();
                            OutputStream os=sock.getOutputStream();
                            os.write(text.getBytes("UTF-8")); os.write("\n\n\n\n".getBytes()); os.flush(); Thread.sleep(800); sock.close();
                        }catch(Exception e){ try{ android.content.Intent b=new android.content.Intent(); b.setAction("com.sunmi.print.action.PRINT_TEXT"); b.putExtra("print_text", text); ctx.sendBroadcast(b); }catch(Exception e2){} }
                    }).start();
                }
            }catch(Exception e){}
            runOnUiThread(()->Toast.makeText(ctx,"🖨️ SAN DYALOG - "+selectedName,Toast.LENGTH_SHORT).show());
        }
        @JavascriptInterface public String getSavedPrinter(){ return ctx.getSharedPreferences("printer", MODE_PRIVATE).getString("mac", "")+"|"+ctx.getSharedPreferences("printer", MODE_PRIVATE).getString("name", ""); }
    }
}

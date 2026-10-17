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
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Set;
import java.util.UUID;
import java.io.OutputStream;

public class MainActivity extends Activity {
    WebView webView; BluetoothAdapter btAdapter; String selectedMac = ""; String selectedName = "";
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
        w.addJavascriptInterface(new PrinterInterface(this), "Android");
        w.setWebViewClient(new WebViewClient(){ public void onPageFinished(WebView view, String url){ view.evaluateJavascript("if(document.getElementById('splash')){document.getElementById('splash').style.display='none';}", null); } });
        w.loadUrl("file:///android_asset/index.html"); btAdapter=BluetoothAdapter.getDefaultAdapter();
    }

    private byte[] bitmapToEscPos(Bitmap bmp){
        try{
            int width = bmp.getWidth(); int height = bmp.getHeight();
            int widthBytes = (width + 7)/8;
            byte[] data = new byte[8 + widthBytes * height];
            int o=0;
            data[o++]=0x1D; data[o++]=0x76; data[o++]=0x30; data[o++]=0x00;
            data[o++]=(byte)(widthBytes & 0xFF); data[o++]=(byte)((widthBytes>>8) & 0xFF);
            data[o++]=(byte)(height & 0xFF); data[o++]=(byte)((height>>8) & 0xFF);
            for(int y=0;y<height;y++){
                for(int xb=0;xb<widthBytes;xb++){
                    byte b=0;
                    for(int bit=0;bit<8;bit++){
                        int x = xb*8+bit;
                        if(x<width){
                            int pixel = bmp.getPixel(x,y);
                            int gray = (((pixel>>16)&0xFF) + ((pixel>>8)&0xFF) + (pixel&0xFF))/3;
                            if(gray<128) b |= (byte)(1 << (7-bit));
                        }
                    }
                    data[o++]=b;
                }
            }
            return data;
        }catch(Exception e){ return new byte[0]; }
    }
    private Bitmap base64ToBitmap(String dataUrl){
        try{
            if(dataUrl==null || dataUrl.length()<100) return null;
            String b64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",")+1) : dataUrl;
            byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(decoded,0,decoded.length);
        }catch(Exception e){ return null; }
    }

    public class PrinterInterface {
        Context ctx; PrinterInterface(Context c){ctx=c;}
        @JavascriptInterface public String scanDevices() {
            try { JSONArray arr=new JSONArray();
                if(btAdapter!=null){ try{ Set<BluetoothDevice> paired=btAdapter.getBondedDevices(); for(BluetoothDevice d:paired){ JSONObject o=new JSONObject(); o.put("name", d.getName()!=null?d.getName():"Unknown"); o.put("mac", d.getAddress()); o.put("type","Bluetooth"); arr.put(o);} }catch(Exception e){} }
                JSONObject sunmi=new JSONObject(); sunmi.put("name","Sunmi V2 Pro - Entèn (58mm)"); sunmi.put("mac","SUNMI_INNER"); sunmi.put("type","Sunmi"); arr.put(sunmi);
                return arr.toString();
            } catch(Exception e){ return "[]"; }
        }
        @JavascriptInterface public void selectPrinter(String mac){ selectedMac=mac; ctx.getSharedPreferences("printer", MODE_PRIVATE).edit().putString("mac", mac).apply(); runOnUiThread(()->Toast.makeText(ctx,"✅ "+mac,Toast.LENGTH_SHORT).show()); }
        @JavascriptInterface public void savePrinter(String mac, String name, String configJson){ selectedMac=mac; selectedName=name; ctx.getSharedPreferences("printer", MODE_PRIVATE).edit().putString("mac", mac).putString("name", name).apply(); runOnUiThread(()->Toast.makeText(ctx,"💾 Anrejistre: "+name,Toast.LENGTH_SHORT).show()); }
        @JavascriptInterface public String getSavedPrinter(){ return ctx.getSharedPreferences("printer", MODE_PRIVATE).getString("mac", "")+"|"+ctx.getSharedPreferences("printer", MODE_PRIVATE).getString("name", ""); }
        @JavascriptInterface public String getPrinterStatus(){ return selectedMac.isEmpty() ? "DISCONNECTED" : "CONNECTED"; }
        @JavascriptInterface public void printLogo(String u){ }
        @JavascriptInterface public void printImage(String u){ }
        @JavascriptInterface public void printBitmap(String u){ }

        @JavascriptInterface
        public void printWithLogo(String logoBase64, String text){
            String macToUse = selectedMac;
            if(macToUse.isEmpty()) macToUse = ctx.getSharedPreferences("printer", MODE_PRIVATE).getString("mac", "00:11:22:33:44:55");
            String finalMac = macToUse; String finalText = text!=null?text:""; String finalLogo = logoBase64!=null?logoBase64:"";

            new Thread(()->{
                try{
                    BluetoothDevice dev = null;
                    try{ dev = btAdapter.getRemoteDevice(finalMac); }catch(Exception e){
                        if(btAdapter!=null){ Set<BluetoothDevice> paired=btAdapter.getBondedDevices(); if(paired!=null) for(BluetoothDevice d: paired){ if(d.getAddress().equals(finalMac) || d.getName().toLowerCase().contains("inner")){ dev=d; break; } } if(dev==null && paired!=null && !paired.isEmpty()) dev=paired.iterator().next(); }
                    }
                    if(dev==null) return;
                    UUID uuid=UUID.fromString("00001101-0000-1000-8000-00805f9B34FB");
                    BluetoothSocket sock=dev.createRfcommSocketToServiceRecord(uuid);
                    btAdapter.cancelDiscovery(); sock.connect();
                    OutputStream os=sock.getOutputStream();

                    // MWAYEN - TI LÈT MWAYEN PWÒP
                    os.write(new byte[]{0x1B, 0x40}); // init
                    os.write(new byte[]{0x1B, 0x61, 0x01}); // center
                    os.write(new byte[]{0x1B, 0x4D, 0x00}); // Font A = MWAYEN
                    os.write(new byte[]{0x1B, 0x21, 0x00}); // size normal
                    os.write(new byte[]{0x1D, 0x21, 0x00}); // pa agrandi

                    // LOGO 20mm SANTRE
                    if(finalLogo.length()>100){
                        Bitmap bmp = base64ToBitmap(finalLogo);
                        if(bmp!=null){
                            int w=200; int h=(int)(bmp.getHeight()*(w/(float)bmp.getWidth()));
                            Bitmap small=Bitmap.createScaledBitmap(bmp,w,h,false);
                            os.write(bitmapToEscPos(small));
                            os.write(new byte[]{0x0A,0x0A});
                        }
                    }

                    if(!finalText.isEmpty()){
                        os.write(finalText.getBytes("UTF-8"));
                    }
                    os.write(new byte[]{0x0A,0x0A,0x0A,0x0A,0x0A});
                    os.flush(); Thread.sleep(600); sock.close();
                }catch(Exception e){ Log.e("PRINT", e.toString()); }
            }).start();
            runOnUiThread(()->Toast.makeText(ctx,"🖨️ MWAYEN",Toast.LENGTH_SHORT).show());
        }
        @JavascriptInterface public void printWithoutDialog(String text){ printWithLogo("", text); }
    }
}

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
import android.Manifest;
import android.content.pm.PackageManager;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.os.Build;
import android.widget.Toast;
import java.util.Set;

public class MainActivity extends Activity {
    private WebView webView;
    private Object sunmiService = null;
    private boolean isConnected = false;
    private static final int REQ_PERM = 101;

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

        demandePermissions();
        initPrinter();

        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.addJavascriptInterface(new PrinterBridge(), "Android");

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onResume(){
        super.onResume();
        // Re-konekte chak fwa ou retounen nan app
        if(sunmiService==null) initPrinter();
    }

    private void demandePermissions(){
        try{
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
                String[] perms;
                if(Build.VERSION.SDK_INT >= 31){
                    perms = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH};
                } else {
                    perms = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.BLUETOOTH, Manifest.permission.BLUETOOTH_ADMIN};
                }
                boolean need=false;
                for(String p: perms){ if(checkSelfPermission(p)!=PackageManager.PERMISSION_GRANTED){ need=true; break; } }
                if(need) requestPermissions(perms, REQ_PERM);
            }
        }catch(Exception e){}
    }

    private void initPrinter(){
        try{
            Class<?> managerClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Class<?> callbackClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback");
            Object callback = java.lang.reflect.Proxy.newProxyInstance(callbackClass.getClassLoader(), new Class[]{callbackClass},
                (proxy, method, args) -> {
                    String name = method.getName();
                    if("onConnected".equals(name)){
                        sunmiService = args[0];
                        isConnected = true;
                        Log.d("SUNMI","CONNECTED OK");
                        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Printer Konekte", Toast.LENGTH_SHORT).show());
                    }
                    if("onDisconnected".equals(name)){ sunmiService=null; isConnected=false; }
                    return null;
                });
            Object mgr = managerClass.getMethod("getInstance").invoke(null);
            managerClass.getMethod("bindService", android.content.Context.class, callbackClass).invoke(mgr, this, callback);
        }catch(Exception e){ Log.e("SUNMI","bind err "+e.getMessage()); }
    }

    private void safePrintText(String text){
        if(sunmiService==null){
            Log.e("PRINT","service NULL - ap re-konekte");
            initPrinter();
            try{ Thread.sleep(800); }catch(Exception ex){}
            if(sunmiService==null){
                runOnUiThread(() -> Toast.makeText(this, "Printer pa konekte - tann 2s epi re-eseye", Toast.LENGTH_LONG).show());
                return;
            }
        }
        try{
            Class<?> c = sunmiService.getClass();
            // Eseye 2 fason diferan (kèk Sunmi gen 1 param, kèk gen 2)
            try{
                // Fason 1: printText(text, callback)
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                c.getMethod("printText", String.class, Object.class).invoke(sunmiService, text, null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 4, null);
            }catch(NoSuchMethodException e1){
                // Fason 2: printText(text)
                try{
                    c.getMethod("setAlignment", int.class).invoke(sunmiService, 1);
                }catch(Exception ex){}
                try{
                    c.getMethod("printText", String.class).invoke(sunmiService, text);
                }catch(Exception ex){
                    c.getMethod("printOriginalText", String.class).invoke(sunmiService, text);
                }
                try{
                    c.getMethod("lineWrap", int.class).invoke(sunmiService, 4);
                }catch(Exception ex){
                    c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 4, null);
                }
            }
            Log.d("PRINT","OK");
        }catch(Exception e){ Log.e("PRINT","ERR "+e.toString()); runOnUiThread(() -> Toast.makeText(this, "Erè enprime: "+e.getMessage(), Toast.LENGTH_LONG).show()); }
    }

    private void safePrintBitmap(String dataUrl){
        if(sunmiService==null) return;
        try{
            if(dataUrl==null || dataUrl.length()<100) return;
            String b64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",")+1) : dataUrl;
            byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
            Bitmap bmp = BitmapFactory.decodeByteArray(decoded,0,decoded.length);
            if(bmp==null) return;
            int w = 200;
            int h = (int)(bmp.getHeight() * (w / (float)bmp.getWidth()));
            Bitmap small = Bitmap.createScaledBitmap(bmp, w, h, false);
            Class<?> c = sunmiService.getClass();
            try{
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                c.getMethod("printBitmap", Bitmap.class, Object.class).invoke(sunmiService, small, null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 2, null);
            }catch(NoSuchMethodException e1){
                c.getMethod("setAlignment", int.class).invoke(sunmiService, 1);
                c.getMethod("printBitmap", Bitmap.class).invoke(sunmiService, small);
                c.getMethod("lineWrap", int.class).invoke(sunmiService, 2);
            }
        }catch(Exception e){ Log.e("LOGO", e.toString()); }
    }

    public class PrinterBridge {
        @JavascriptInterface public String getPrinterStatus(){ return isConnected && sunmiService!=null ? "CONNECTED" : "DISCONNECTED - tann 2s"; }

        @JavascriptInterface
        public String scanDevices(){
            StringBuilder json = new StringBuilder("[");
            json.append("{\"name\":\"InnerPrinter\",\"mac\":\"00:11:22:33:44:55\",\"type\":\"sunmi\"}");
            json.append(",{\"name\":\"Sunmi Interne\",\"mac\":\"SUNMI_INNER\",\"type\":\"sunmi\"}");
            try{
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if(adapter!=null){
                    if(Build.VERSION.SDK_INT >= 31 && checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED){
                        json.append("]"); return json.toString();
                    }
                    Set<BluetoothDevice> bonded = adapter.getBondedDevices();
                    if(bonded!=null){
                        for(BluetoothDevice d : bonded){
                            String name = d.getName(); if(name==null) name="Printer";
                            json.append(",{\"name\":\"").append(name.replace("\"","")).append(" - bluetooth\",\"mac\":\"").append(d.getAddress()).append("\",\"type\":\"bluetooth\"}");
                        }
                    }
                    if(!adapter.isDiscovering()) adapter.startDiscovery();
                }
            }catch(Exception e){}
            json.append("]");
            return json.toString();
        }

        @JavascriptInterface public void selectPrinter(String mac){ Log.d("SELECT", mac); }
        @JavascriptInterface public void savePrinter(String mac,String name,String cfg){}

        @JavascriptInterface public void printWithoutDialog(String text){ safePrintText(text); }
        @JavascriptInterface public void printLogo(String u){ safePrintBitmap(u); }
        @JavascriptInterface public void printImage(String u){ safePrintBitmap(u); }
        @JavascriptInterface public void printBitmap(String u){ safePrintBitmap(u); }

        @JavascriptInterface
        public void printWithLogo(String logo, String text){
            if(logo!=null && logo.length()>100) safePrintBitmap(logo);
            try{ Thread.sleep(400); }catch(Exception ex){}
            safePrintText(text);
        }
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        try{
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if(adapter!=null) adapter.cancelDiscovery();
        }catch(Exception e){}
    }
}

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

        // Mande otorizasyon otomatik
        demandePermissions();

        initPrinter();

        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.addJavascriptInterface(new PrinterBridge(), "Android");

        webView.loadUrl("file:///android_asset/index.html");
    }

    private void demandePermissions(){
        try{
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
                String[] perms;
                if(Build.VERSION.SDK_INT >= 31){
                    perms = new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.BLUETOOTH_SCAN,
                        Manifest.permission.BLUETOOTH_CONNECT,
                        Manifest.permission.BLUETOOTH
                    };
                } else {
                    perms = new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.BLUETOOTH,
                        Manifest.permission.BLUETOOTH_ADMIN
                    };
                }
                boolean need=false;
                for(String p: perms){
                    if(checkSelfPermission(p)!=PackageManager.PERMISSION_GRANTED){ need=true; break; }
                }
                if(need) requestPermissions(perms, REQ_PERM);
            }
        }catch(Exception e){ Log.e("PERM", e.toString()); }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results){
        super.onRequestPermissionsResult(code, perms, results);
        Log.d("PERM","otorizasyon reponn");
    }

    private void initPrinter(){
        try{
            Class<?> managerClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Class<?> callbackClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback");
            Object callback = java.lang.reflect.Proxy.newProxyInstance(
                callbackClass.getClassLoader(),
                new Class[]{callbackClass},
                new java.lang.reflect.InvocationHandler(){
                    @Override
                    public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable {
                        String name = method.getName();
                        if("onConnected".equals(name)){
                            sunmiService = args[0];
                            isConnected = true;
                        }
                        if("onDisconnected".equals(name)){
                            sunmiService = null;
                            isConnected = false;
                        }
                        return null;
                    }
                }
            );
            Object mgr = managerClass.getMethod("getInstance").invoke(null);
            managerClass.getMethod("bindService", android.content.Context.class, callbackClass).invoke(mgr, this, callback);
        }catch(Exception e){ Log.e("SUNMI","init err "+e.getMessage()); }
    }

    public class PrinterBridge {
        @JavascriptInterface public String getPrinterStatus(){ return isConnected ? "CONNECTED" : "DISCONNECTED"; }

        @JavascriptInterface
        public String scanDevices(){
            StringBuilder json = new StringBuilder("[");
            // 1 - Sunmi Interne toujou la
            json.append("{\"name\":\"Sunmi Interne\",\"mac\":\"SUNMI_INNER\",\"type\":\"sunmi\"}");

            // 2 - Detekte tout aparèy Bluetooth apwoksimite ki deja pè
            try{
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if(adapter!=null){
                    if(Build.VERSION.SDK_INT >= 31){
                        if(checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED){
                            // si pa gen pèmisyon, retounen sèlman Sunmi
                            json.append("]");
                            return json.toString();
                        }
                    }
                    // Aparèy ki deja konekte
                    Set<BluetoothDevice> bonded = adapter.getBondedDevices();
                    if(bonded!=null){
                        for(BluetoothDevice d : bonded){
                            String name = d.getName();
                            String mac = d.getAddress();
                            if(name==null) name="Printer";
                            // Filtre sèlman printer
                            json.append(",{\"name\":\"").append(name.replace("\"","")).append("\",\"mac\":\"").append(mac).append("\",\"type\":\"bluetooth\"}");
                        }
                    }
                    // Lanse rechèch pou nouvo aparèy apwoksimite
                    try{
                        if(Build.VERSION.SDK_INT >= 31){
                            if(checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN)==PackageManager.PERMISSION_GRANTED){
                                if(!adapter.isDiscovering()) adapter.startDiscovery();
                            }
                        }else{
                            if(!adapter.isDiscovering()) adapter.startDiscovery();
                        }
                    }catch(Exception ex){}
                }
            }catch(Exception e){ Log.e("SCAN", e.toString()); }

            json.append("]");
            Log.d("SCAN", json.toString());
            return json.toString();
        }

        @JavascriptInterface public void selectPrinter(String mac){
            Log.d("SELECT", mac);
            try{
                if(mac!=null && !mac.equals("SUNMI_INNER") && sunmiService==null){
                    // Eseye konekte Bluetooth si se pa Sunmi - kite WebView jere
                }
            }catch(Exception e){}
        }
        @JavascriptInterface public void savePrinter(String mac,String name,String cfg){}

        @JavascriptInterface
        public void printWithoutDialog(String text){
            try{
                if(sunmiService==null){ Log.e("PRINT","service null"); return; }
                Class<?> c = sunmiService.getClass();
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                c.getMethod("printText", String.class, Object.class).invoke(sunmiService, text, null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 4, null);
            }catch(Exception e){ Log.e("PRINT", e.toString()); }
        }

        @JavascriptInterface public void printLogo(String u){ printBitmap(u); }
        @JavascriptInterface public void printImage(String u){ printBitmap(u); }

        @JavascriptInterface
        public void printBitmap(String dataUrl){
            try{
                if(sunmiService==null) return;
                if(dataUrl==null || dataUrl.length()<100) return;
                String b64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",")+1) : dataUrl;
                byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
                Bitmap bmp = BitmapFactory.decodeByteArray(decoded,0,decoded.length);
                if(bmp==null) return;
                int w = 200;
                int h = (int)(bmp.getHeight() * (w / (float)bmp.getWidth()));
                Bitmap small = Bitmap.createScaledBitmap(bmp, w, h, false);
                Class<?> c = sunmiService.getClass();
                c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                c.getMethod("printBitmap", Bitmap.class, Object.class).invoke(sunmiService, small, null);
                c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 2, null);
            }catch(Exception e){ Log.e("LOGO", e.toString()); }
        }

        @JavascriptInterface
        public void printWithLogo(String logo, String text){
            try{
                if(logo!=null && logo.length()>100){
                    printBitmap(logo);
                    try{ Thread.sleep(400); }catch(Exception ex){}
                }
                printWithoutDialog(text);
            }catch(Exception e){ printWithoutDialog(text); }
        }
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        try{
            Class<?> managerClass = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager");
            Object mgr = managerClass.getMethod("getInstance").invoke(null);
            try{
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if(adapter!=null) adapter.cancelDiscovery();
            }catch(Exception ex){}
        }catch(Exception e){}
    }
}

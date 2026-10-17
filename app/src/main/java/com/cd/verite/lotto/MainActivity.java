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
import android.bluetooth.BluetoothSocket;
import android.os.Build;
import android.widget.Toast;
import java.util.Set;
import java.util.UUID;
import java.io.OutputStream;
import android.content.SharedPreferences;

public class MainActivity extends Activity {
    private WebView webView;
    private Object sunmiService = null;
    private boolean isConnected = false;
    private static final int REQ_PERM = 101;
    private String savedMac = "";
    private String savedName = "";

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

        SharedPreferences pref = getSharedPreferences("printer", MODE_PRIVATE);
        savedMac = pref.getString("mac", "");
        savedName = pref.getString("name", "");

        demandePermissions();
        initPrinter();

        webView.addJavascriptInterface(new PrinterBridge(), "AndroidPrinter");
        webView.addJavascriptInterface(new PrinterBridge(), "Android");

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override protected void onResume(){ super.onResume(); if(sunmiService==null) initPrinter(); }

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
                    if("onConnected".equals(method.getName())){ sunmiService=args[0]; isConnected=true; Log.d("SUNMI","CONNECTED"); }
                    if("onDisconnected".equals(method.getName())){ sunmiService=null; isConnected=false; }
                    return null;
                });
            Object mgr = managerClass.getMethod("getInstance").invoke(null);
            managerClass.getMethod("bindService", android.content.Context.class, callbackClass).invoke(mgr, this, callback);
        }catch(Exception e){ Log.d("SUNMI","pa Sunmi device - ap itilize Bluetooth"); }
    }

    // --- BLUETOOTH PRINT ---
    private boolean printViaBluetooth(String text, String logoBase64){
        try{
            if(savedMac==null || savedMac.isEmpty() || savedMac.equals("SUNMI_INNER")){
                // Chèche dènye aparèy ki anrejistre nan prefs
                SharedPreferences pref = getSharedPreferences("printer", MODE_PRIVATE);
                savedMac = pref.getString("mac", "");
                if(savedMac.isEmpty()) savedMac = "00:11:22:33:44:55"; // default InnerPrinter foto ou
            }
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if(adapter==null){ runOnUiThread(() -> Toast.makeText(this, "Bluetooth pa disponib", Toast.LENGTH_LONG).show()); return false; }
            if(Build.VERSION.SDK_INT >= 31 && checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED){
                runOnUiThread(() -> Toast.makeText(this, "Bay pèmisyon Bluetooth", Toast.LENGTH_LONG).show());
                return false;
            }
            BluetoothDevice device = null;
            try{
                device = adapter.getRemoteDevice(savedMac);
            }catch(Exception e){
                // Eseye jwenn nan bonded
                Set<BluetoothDevice> bonded = adapter.getBondedDevices();
                if(bonded!=null) for(BluetoothDevice d: bonded){ if(d.getAddress().equals(savedMac) || d.getName().contains("Inner")){ device=d; break; } }
                if(device==null && bonded!=null && !bonded.isEmpty()) device = bonded.iterator().next();
            }
            if(device==null){ runOnUiThread(() -> Toast.makeText(this, "Printer "+savedMac+" pa jwenn - pè li nan Bluetooth Settings", Toast.LENGTH_LONG).show()); return false; }

            UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
            BluetoothSocket socket = device.createRfcommSocketToServiceRecord(uuid);
            adapter.cancelDiscovery();
            socket.connect();
            OutputStream out = socket.getOutputStream();

            // Logo si genyen - santre
            if(logoBase64!=null && logoBase64.length()>100){
                try{
                    String b64 = logoBase64.contains(",") ? logoBase64.substring(logoBase64.indexOf(",")+1) : logoBase64;
                    byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
                    Bitmap bmp = BitmapFactory.decodeByteArray(decoded,0,decoded.length);
                    if(bmp!=null){
                        // Resize 200px
                        int w = 200; int h = (int)(bmp.getHeight() * (w/(float)bmp.getWidth()));
                        Bitmap small = Bitmap.createScaledBitmap(bmp, w, h, false);
                        // ESC/POS santre
                        out.write(new byte[]{0x1B, 0x61, 0x01}); // center
                        byte[] escBmp = bitmapToEscPos(small);
                        out.write(escBmp);
                        out.write(new byte[]{0x0A,0x0A});
                    }
                }catch(Exception e){ Log.e("LOGO_BT", e.toString()); }
            }

            out.write(new byte[]{0x1B, 0x61, 0x01}); // center
            out.write(text.getBytes("UTF-8"));
            out.write(new byte[]{0x0A,0x0A,0x0A,0x0A});
            out.flush();
            Thread.sleep(500);
            out.close();
            socket.close();
            runOnUiThread(() -> Toast.makeText(this, "Enprime OK sou "+device.getName(), Toast.LENGTH_SHORT).show());
            return true;
        }catch(Exception e){
            Log.e("BT_PRINT","ERR "+e.toString());
            String msg = e.getMessage();
            runOnUiThread(() -> Toast.makeText(this, "Erè Bluetooth: "+msg, Toast.LENGTH_LONG).show());
            return false;
        }
    }

    // Konvèti Bitmap -> ESC/POS
    private byte[] bitmapToEscPos(Bitmap bmp){
        try{
            int width = bmp.getWidth();
            int height = bmp.getHeight();
            int widthBytes = (width + 7)/8;
            byte[] data = new byte[8 + widthBytes * height];
            int offset=0;
            data[offset++]=0x1D; data[offset++]=0x76; data[offset++]=0x30; data[offset++]=0x00;
            data[offset++]=(byte)(widthBytes & 0xFF);
            data[offset++]=(byte)((widthBytes>>8) & 0xFF);
            data[offset++]=(byte)(height & 0xFF);
            data[offset++]=(byte)((height>>8) & 0xFF);
            for(int y=0;y<height;y++){
                for(int xByte=0;xByte<widthBytes;xByte++){
                    byte b=0;
                    for(int bit=0;bit<8;bit++){
                        int x = xByte*8+bit;
                        if(x<width){
                            int pixel = bmp.getPixel(x,y);
                            int r = (pixel>>16)&0xFF;
                            int g = (pixel>>8)&0xFF;
                            int bl = pixel&0xFF;
                            int gray = (r+g+bl)/3;
                            if(gray<128) b |= (byte)(1 << (7-bit));
                        }
                    }
                    data[offset++]=b;
                }
            }
            return data;
        }catch(Exception e){ return new byte[0]; }
    }

    public class PrinterBridge {
        @JavascriptInterface public String getPrinterStatus(){
            SharedPreferences pref = getSharedPreferences("printer", MODE_PRIVATE);
            String mac = pref.getString("mac","");
            if(isConnected && sunmiService!=null) return "CONNECTED Sunmi";
            if(mac!=null && !mac.isEmpty()) return "CONNECTED Bluetooth "+mac;
            return "DISCONNECTED";
        }

        @JavascriptInterface
        public String scanDevices(){
            StringBuilder json = new StringBuilder("[");
            json.append("{\"name\":\"InnerPrinter\",\"mac\":\"00:11:22:33:44:55\",\"type\":\"bluetooth\"}");
            json.append(",{\"name\":\"Sunmi Interne\",\"mac\":\"SUNMI_INNER\",\"type\":\"sunmi\"}");
            try{
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if(adapter!=null){
                    if(Build.VERSION.SDK_INT >= 31 && checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED){
                        json.append("]"); return json.toString();
                    }
                    Set<BluetoothDevice> bonded = adapter.getBondedDevices();
                    if(bonded!=null){
                        for(BluetoothDevice d: bonded){
                            String name = d.getName(); if(name==null) name="Printer";
                            if(!d.getAddress().equals("00:11:22:33:44:55")){
                                json.append(",{\"name\":\"").append(name.replace("\"","")).append("\",\"mac\":\"").append(d.getAddress()).append("\",\"type\":\"bluetooth\"}");
                            }
                        }
                    }
                    if(!adapter.isDiscovering()) adapter.startDiscovery();
                }
            }catch(Exception e){}
            json.append("]");
            return json.toString();
        }

        @JavascriptInterface public void selectPrinter(String mac){
            try{
                SharedPreferences pref = getSharedPreferences("printer", MODE_PRIVATE);
                pref.edit().putString("mac", mac).apply();
                savedMac = mac;
                Log.d("SELECT", mac);
            }catch(Exception e){}
        }
        @JavascriptInterface public void savePrinter(String mac,String name,String cfg){
            try{
                SharedPreferences pref = getSharedPreferences("printer", MODE_PRIVATE);
                pref.edit().putString("mac", mac).putString("name", name).putString("cfg", cfg).apply();
                savedMac=name; savedMac=mac; savedName=name;
                Log.d("SAVE", mac+" "+name);
            }catch(Exception e){}
        }

        @JavascriptInterface public void printWithoutDialog(String text){
            if(sunmiService!=null){
                try{
                    Class<?> c = sunmiService.getClass();
                    c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                    c.getMethod("printText", String.class, Object.class).invoke(sunmiService, text, null);
                    c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 4, null);
                    return;
                }catch(Exception e){ Log.e("SUNMI_PRINT", e.toString()); }
            }
            // Fallback Bluetooth
            printViaBluetooth(text, null);
        }

        @JavascriptInterface public void printLogo(String u){ printViaBluetooth("", u); }
        @JavascriptInterface public void printImage(String u){ printViaBluetooth("", u); }
        @JavascriptInterface public void printBitmap(String u){ printViaBluetooth("", u); }

        @JavascriptInterface
        public void printWithLogo(String logo, String text){
            if(sunmiService!=null){
                try{
                    if(logo!=null && logo.length()>100){
                        String b64 = logo.contains(",") ? logo.substring(logo.indexOf(",")+1) : logo;
                        byte[] decoded = Base64.decode(b64, Base64.DEFAULT);
                        Bitmap bmp = BitmapFactory.decodeByteArray(decoded,0,decoded.length);
                        if(bmp!=null){
                            int w=200; int h=(int)(bmp.getHeight()*(w/(float)bmp.getWidth()));
                            Bitmap small = Bitmap.createScaledBitmap(bmp, w, h, false);
                            Class<?> c = sunmiService.getClass();
                            c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                            c.getMethod("printBitmap", Bitmap.class, Object.class).invoke(sunmiService, small, null);
                            c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 1, null);
                            Thread.sleep(300);
                        }
                    }
                    Class<?> c = sunmiService.getClass();
                    c.getMethod("setAlignment", int.class, Object.class).invoke(sunmiService, 1, null);
                    c.getMethod("printText", String.class, Object.class).invoke(sunmiService, text, null);
                    c.getMethod("lineWrap", int.class, Object.class).invoke(sunmiService, 4, null);
                    return;
                }catch(Exception e){}
            }
            printViaBluetooth(text, logo);
        }
    }
}

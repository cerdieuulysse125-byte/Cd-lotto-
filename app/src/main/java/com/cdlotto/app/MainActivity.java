package com.cdlotto.app;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private BluetoothAdapter bluetoothAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout main = new LinearLayout(this);
        main.setOrientation(LinearLayout.VERTICAL);
        webView = new WebView(this);
        main.addView(webView, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        
        Button btnExit = new Button(this);
        btnExit.setText("⬛ SÒTI NÈT");
        btnExit.setBackgroundColor(Color.parseColor("#D32F2F"));
        btnExit.setTextColor(Color.WHITE);
        btnExit.setTextSize(18);
        main.addView(btnExit, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        btnExit.setOnClickListener(v -> { finishAndRemoveTask(); finishAffinity(); System.exit(0); });
        setContentView(main);

        // Tcheke si index.html egziste
        try {
            AssetManager am = getAssets();
            InputStream is = am.open("index.html");
            is.close();
            Toast.makeText(this, "index.html jwenn OK", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Toast.makeText(this, "ERÈ: index.html PA nan assets! " + e.getMessage(), Toast.LENGTH_LONG).show();
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        }

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowUniversalAccessFromFileURLs(true);
        ws.setCacheMode(WebSettings.LOAD_NO_CACHE);
        ws.setDomStorageEnabled(true);

        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new Bridge(), "AndroidPrinter");
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        webView.loadUrl("file:///android_asset/index.html");
    }

    public class Bridge {
        @JavascriptInterface public void printText(String d){ runOnUiThread(()-> doPrint(d)); }
        @JavascriptInterface public void print(String d){ printText(d); }
        @JavascriptInterface public void exitApp(){ runOnUiThread(()->{ finishAndRemoveTask(); finishAffinity(); System.exit(0); }); }
    }

    private void doPrint(String data){
        try{
            if(bluetoothAdapter==null){ Toast.makeText(this,"Bluetooth pa gen",Toast.LENGTH_SHORT).show(); return; }
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.S && ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED) return;
            boolean ok=false;
            for(BluetoothDevice dev: bluetoothAdapter.getBondedDevices()){
                String n = dev.getName()!=null?dev.getName().toLowerCase():"";
                if(n.contains("58")||n.contains("print")||n.contains("pos")||n.contains("mtp")||n.contains("bluetooth")){
                    if(btPrint(dev,data)){ ok=true; break; }
                }
            }
            if(!ok && !bluetoothAdapter.getBondedDevices().isEmpty()){
                btPrint(bluetoothAdapter.getBondedDevices().iterator().next(), data);
            }
        }catch(Exception e){ Toast.makeText(this,e.getMessage(),Toast.LENGTH_LONG).show(); }
    }
    private boolean btPrint(BluetoothDevice dev, String data){
        try{
            UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
            BluetoothSocket s = dev.createRfcommSocketToServiceRecord(uuid);
            s.connect(); OutputStream os=s.getOutputStream();
            os.write(data.getBytes("UTF-8")); os.write("\n\n\n".getBytes()); os.write(new byte[]{0x1D,0x56,0x00});
            os.flush(); os.close(); s.close();
            Toast.makeText(this,"Enprime: "+dev.getName(),Toast.LENGTH_SHORT).show(); return true;
        }catch(Exception e){ return false; }
    }
}

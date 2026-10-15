package com.cdlotto.app;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
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
        LinearLayout.LayoutParams wp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f);
        main.addView(webView, wp);

        Button btnExit = new Button(this);
        btnExit.setText("⬛ SÒTI NÈT - FÈMEN APP LA");
        btnExit.setBackgroundColor(Color.parseColor("#D32F2F"));
        btnExit.setTextColor(Color.WHITE);
        btnExit.setTextSize(18);
        btnExit.setAllCaps(false);
        LinearLayout.LayoutParams ep = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        ep.setMargins(10,10,10,10);
        main.addView(btnExit, ep);
        btnExit.setOnClickListener(v -> {
            finishAndRemoveTask(); finishAffinity(); System.exit(0);
        });
        setContentView(main);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ActivityCompat.requestPermissions(this, new String[]{
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.ACCESS_FINE_LOCATION
            }, 1);
        }

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true); // REGLE "Chwazi Tiraj"
        ws.setDatabaseEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowUniversalAccessFromFileURLs(true);
        ws.setCacheMode(WebSettings.LOAD_NO_CACHE);

        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new Bridge(), "AndroidPrinter");
        webView.addJavascriptInterface(new Bridge(), "CDLotto");
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        webView.loadUrl("file:///android_asset/index.html");
    }

    public class Bridge {
        @JavascriptInterface public void printText(String d){ runOnUiThread(()-> doPrint(d)); }
        @JavascriptInterface public void print(String d){ printText(d); }
        @JavascriptInterface public void exitApp(){ runOnUiThread(()->{ finishAndRemoveTask(); finishAffinity(); System.exit(0); }); }
        @JavascriptInterface public void sorti(){ exitApp(); }
    }

    private void doPrint(String data){
        try{
            if(bluetoothAdapter==null) return;
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.S && ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT)!=PackageManager.PERMISSION_GRANTED) return;
            for(BluetoothDevice dev: bluetoothAdapter.getBondedDevices()){
                String n = dev.getName()!=null?dev.getName().toLowerCase():"";
                if(n.contains("58")||n.contains("print")||n.contains("pos")||n.contains("mtp")){
                    if(btPrint(dev,data)) return;
                }
            }
            if(!bluetoothAdapter.getBondedDevices().isEmpty()){
                btPrint(bluetoothAdapter.getBondedDevices().iterator().next(), data);
            } else {
                Toast.makeText(this,"Pair printer 58mm nan Bluetooth Settings",Toast.LENGTH_LONG).show();
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

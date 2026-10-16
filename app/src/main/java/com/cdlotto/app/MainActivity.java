package com.cd.verite.lotto;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Set;

public class MainActivity extends AppCompatActivity {
    WebView webView;
    BluetoothAdapter bluetoothAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView); // SÈLMAN WebView - PA GEN BA DEYÒ

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.S){
            ActivityCompat.requestPermissions(this, new String[]{
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.ACCESS_FINE_LOCATION
            }, 1);
        }

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        webView.addJavascriptInterface(new BluetoothBridge(), "Android");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");

        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    public class BluetoothBridge {
        @JavascriptInterface
        public String scanDevices() {
            try {
                if(bluetoothAdapter == null) return "[]";
                if(!bluetoothAdapter.isEnabled()) bluetoothAdapter.enable();
                if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.S){
                    if(ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.BLUETOOTH_CONNECT)!= PackageManager.PERMISSION_GRANTED) return "[]";
                }
                Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
                JSONArray arr = new JSONArray();
                for(BluetoothDevice device : pairedDevices){
                    JSONObject obj = new JSONObject();
                    obj.put("name", device.getName()!= null? device.getName() : device.getAddress());
                    obj.put("address", device.getAddress());
                    obj.put("id", device.getAddress());
                    arr.put(obj);
                }
                // Ajoute InnerPrinter si se Sunmi
                if(Build.MANUFACTURER.toLowerCase().contains("sunmi") || Build.MODEL.toLowerCase().contains("sunmi")){
                    JSONObject sunmi = new JSONObject();
                    sunmi.put("name", "InnerPrinter");
                    sunmi.put("address", "inner_printer");
                    sunmi.put("id", "inner_printer");
                    arr.put(sunmi);
                }
                return arr.toString();
            } catch(Exception e){ return "[]"; }
        }
    }
}

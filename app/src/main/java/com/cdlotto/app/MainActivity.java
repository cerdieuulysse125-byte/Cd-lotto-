package com.cdlotto.app;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.*;
import java.io.OutputStream;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private WebView webView;
    private TextView status;
    private Spinner deviceSpinner;
    private List<BluetoothDevice> deviceList = new ArrayList<>();
    private BluetoothSocket btSocket;
    private OutputStream btOutput;
    private BluetoothDevice lastDevice;
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public class AndroidPrinter {
        @JavascriptInterface
        public void printText(String text) {
            runOnUiThread(() -> {
                try {
                    if (btSocket == null || !btSocket.isConnected()) {
                        status.setText("❌ Pa konekte - Chwazi aparèy anwo a");
                        Toast.makeText(MainActivity.this, "Chwazi enprimant lan anwo a dabo", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    btOutput.write(new byte[]{0x1B, 0x40});
                    btOutput.write(text.getBytes("UTF-8"));
                    btOutput.write(new byte[]{0x0A,0x0A,0x0A,0x0A,0x1D,0x56,0x01});
                    btOutput.flush();
                    status.setText("✅ ENPRIME OK: " + lastDevice.getName());
                    Toast.makeText(MainActivity.this, "✅ Fich voye!", Toast.LENGTH_SHORT).show();
                } catch (Exception e) { status.setText("❌ Erè enprime: " + e.getMessage()); }
            });
        }
        @JavascriptInterface public String scanBluetooth() { return getDevicesJson(); }
        @JavascriptInterface public boolean isConnected() { return btSocket!=null && btSocket.isConnected(); }
        @JavascriptInterface public String getStatus() { return btSocket!=null && btSocket.isConnected() ? lastDevice.getName() : "Pa konekte"; }
    }

    private String getDevicesJson() {
        try {
            JSONArray arr = new JSONArray();
            for (BluetoothDevice d : deviceList) {
                JSONObject o = new JSONObject();
                o.put("name", d.getName()); o.put("address", d.getAddress());
                arr.put(o);
            }
            return arr.toString();
        } catch (Exception e) { return "[]"; }
    }

    private void scanDevices() {
        deviceList.clear();
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter==null) { status.setText("❌ Telefòn sa pa gen Bluetooth"); return; }
            if (!adapter.isEnabled()) adapter.enable();
            Set<BluetoothDevice> paired = adapter.getBondedDevices();
            deviceList.addAll(paired);
            
            List<String> names = new ArrayList<>();
            for (BluetoothDevice d : deviceList) names.add(d.getName() + " (" + d.getAddress() + ")");
            
            if (names.isEmpty()) {
                names.add("Aucun aparèy pè - Ale nan Settings Bluetooth");
                status.setText("❌ Pa gen aparèy pè - Pè enprimant lan nan Android Settings");
            } else {
                status.setText("✅ " + names.size() + " aparèy jwenn - Chwazi youn");
            }
            
            ArrayAdapter<String> ad = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, names);
            deviceSpinner.setAdapter(ad);
        } catch (Exception e) { status.setText("❌ Erè scan: " + e.getMessage()); }
    }

    private void connectSelected() {
        try {
            int pos = deviceSpinner.getSelectedItemPosition();
            if (pos<0 || pos>=deviceList.size()) { status.setText("❌ Chwazi yon aparèy"); return; }
            BluetoothDevice dev = deviceList.get(pos);
            status.setText("🔌 Ap konekte ak " + dev.getName() + "...");
            
            if (btSocket!=null) try{btSocket.close();}catch(Exception e){}
            
            btSocket = dev.createRfcommSocketToServiceRecord(MY_UUID);
            btSocket.connect();
            btOutput = btSocket.getOutputStream();
            lastDevice = dev;
            status.setText("✅ KONEKTE: " + dev.getName() + " - Pare pou enprime!");
            Toast.makeText(this, "Konekte ak " + dev.getName(), Toast.LENGTH_LONG).show();
            
            // teste enprime otomatik
            btOutput.write(new byte[]{0x1B,0x40});
            btOutput.write("=== CD LOTTO ===\nKoneksyon OK\n".getBytes());
            btOutput.write(new byte[]{0x0A,0x0A,0x0A});
            btOutput.flush();
            
        } catch (Exception e) {
            status.setText("❌ ECHEC: " + e.getMessage() + " - Eseye etenn/limen enprimant lan");
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout main = new LinearLayout(this); main.setOrientation(LinearLayout.VERTICAL);
        
        status = new TextView(this);
        status.setText("CD LOTTO V36 - SCAN JENERAL - Chwazi enprimant");
        status.setBackgroundColor(Color.BLACK); status.setTextColor(Color.YELLOW); status.setPadding(12,12,12,12); status.setTextSize(11);
        main.addView(status, new LinearLayout.LayoutParams(-1, -2));
        
        // BAR POU SCAN APARÈY YO - SA OU TE MANDE A
        LinearLayout bar = new LinearLayout(this); bar.setOrientation(LinearLayout.HORIZONTAL); bar.setBackgroundColor(Color.parseColor("#E8F5E9")); bar.setPadding(8,8,8,8);
        deviceSpinner = new Spinner(this); bar.addView(deviceSpinner, new LinearLayout.LayoutParams(0, -2, 1f));
        
        Button btnScan = new Button(this); btnScan.setText("SCAN APARÈY YO"); btnScan.setTextSize(10); btnScan.setBackgroundColor(Color.parseColor("#4CAF50")); btnScan.setTextColor(Color.WHITE);
        btnScan.setOnClickListener(v->scanDevices());
        bar.addView(btnScan, new LinearLayout.LayoutParams(-2, -2));
        
        Button btnConnect = new Button(this); btnConnect.setText("KONEKTE"); btnConnect.setTextSize(10); btnConnect.setBackgroundColor(Color.parseColor("#2196F3")); btnConnect.setTextColor(Color.WHITE);
        btnConnect.setOnClickListener(v->connectSelected());
        bar.addView(btnConnect, new LinearLayout.LayoutParams(-2, -2));
        
        main.addView(bar, new LinearLayout.LayoutParams(-1, -2));
        
        webView = new WebView(this);
        main.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1f));
        
        Button btnExit = new Button(this); btnExit.setText("SOTI NET - FEMEN"); btnExit.setBackgroundColor(Color.RED); btnExit.setTextColor(Color.WHITE);
        main.addView(btnExit, new LinearLayout.LayoutParams(-1, 120));
        btnExit.setOnClickListener(v->{ try{if(btSocket!=null)btSocket.close();}catch(Exception e){} finishAffinity(); System.exit(0); });
        
        setContentView(main);
        
        WebSettings s = webView.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setAllowFileAccess(true); s.setAllowUniversalAccessFromFileURLs(true); s.setAllowFileAccessFromFileURLs(true); s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.addJavascriptInterface(new AndroidPrinter(), "AndroidPrinter");
        webView.loadUrl("file:///android_asset/index.html");
        
        // scan otomatik le app ouvri
        scanDevices();
    }
}

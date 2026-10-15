package com.cdlotto.app;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.*;
import java.io.OutputStream;
import java.util.*;

public class MainActivity extends Activity {
    private WebView webView;
    private TextView status;
    private Spinner deviceSpinner;
    private List<BluetoothDevice> deviceList = new ArrayList<>();
    private BluetoothSocket btSocket;
    private OutputStream btOutput;
    private BluetoothDevice lastDevice;
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private static final int REQ_BT = 101;

    public class AndroidPrinter {
        @JavascriptInterface
        public void printText(String text) {
            runOnUiThread(() -> doPrint(text));
        }
        @JavascriptInterface
        public void printFich(String text) { printText(text); }
        @JavascriptInterface
        public void printRapport(String text) { printText(text); }
        @JavascriptInterface public boolean isConnected() { return btSocket!=null && btSocket.isConnected(); }
        @JavascriptInterface public String getStatus() { return btSocket!=null && btSocket.isConnected()? lastDevice.getName() : "Pa konekte"; }
        @JavascriptInterface public String getDeviceName() { return lastDevice!=null? lastDevice.getName() : ""; }
    }

    private void doPrint(String text) {
        try {
            if (btSocket==null ||!btSocket.isConnected()) {
                status.setText("❌ Pa konekte - Klike KONEKTE anwo");
                Toast.makeText(this, "Konekte anwo dabo", Toast.LENGTH_SHORT).show();
                return;
            }
            status.setText("🖨️ Ap enprime " + text.length() + " karaktè...");
            btOutput.write(new byte[]{0x1B,0x40}); // init
            btOutput.write(text.getBytes("UTF-8"));
            btOutput.write(new byte[]{0x0A,0x0A,0x0A,0x0A,0x1D,0x56,0x01}); // cut
            btOutput.flush();
            status.setText("✅ ENPRIME OK: " + lastDevice.getName());
        } catch (Exception e) { status.setText("❌ Erè enprime: " + e.getMessage()); }
    }

    private void checkPermissions() {
        if (Build.VERSION.SDK_INT >= 31) {
            List<String> perms = new ArrayList<>();
            if (checkSelfPermission(android.Manifest.permission.BLUETOOTH_CONNECT)!= PackageManager.PERMISSION_GRANTED) perms.add(android.Manifest.permission.BLUETOOTH_CONNECT);
            if (checkSelfPermission(android.Manifest.permission.BLUETOOTH_SCAN)!= PackageManager.PERMISSION_GRANTED) perms.add(android.Manifest.permission.BLUETOOTH_SCAN);
            if (!perms.isEmpty()) { requestPermissions(perms.toArray(new String[0]), REQ_BT); return; }
        }
        scanDevices();
    }
    @Override public void onRequestPermissionsResult(int c, String[] p, int[] r){ super.onRequestPermissionsResult(c,p,r); if(c==REQ_BT) scanDevices(); }

    private void scanDevices() {
        deviceList.clear();
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter==null) return;
            if (!adapter.isEnabled()) adapter.enable();
            if (Build.VERSION.SDK_INT >= 31 && checkSelfPermission(android.Manifest.permission.BLUETOOTH_CONNECT)!= PackageManager.PERMISSION_GRANTED) return;
            deviceList.addAll(adapter.getBondedDevices());
            List<String> names = new ArrayList<>();
            for (BluetoothDevice d : deviceList) names.add((d.getName()!=null?d.getName():"Unknown") + " (" + d.getAddress() + ")");
            if (names.isEmpty()) names.add("Pa gen aparèy - Pè nan Settings");
            else status.setText("✅ " + names.size() + " aparèy - Chwazi epi KONEKTE");
            deviceSpinner.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, names));
        } catch (Exception e) { status.setText("❌ "+e.getMessage()); }
    }

    private void connectSelected() {
        try {
            int pos = deviceSpinner.getSelectedItemPosition();
            if (pos<0 || pos>=deviceList.size()) return;
            BluetoothDevice dev = deviceList.get(pos);
            status.setText("🔌 Konekte ak " + dev.getName() + "...");
            if (btSocket!=null) try{btSocket.close();}catch(Exception e){}
            btSocket = dev.createRfcommSocketToServiceRecord(MY_UUID);
            btSocket.connect();
            btOutput = btSocket.getOutputStream();
            lastDevice = dev;
            status.setText("✅ KONEKTE: " + dev.getName() + " - Pare!");
            // TI TÈS
            doPrint("=== CD LOTTO V38 ===\n" + dev.getName() + "\nKoneksyon OK!\n");
        } catch (Exception e) { status.setText("❌ Echec: " + e.getMessage()); }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout main = new LinearLayout(this); main.setOrientation(LinearLayout.VERTICAL);
        status = new TextView(this);
        status.setText("CD LOTTO V38 - Inivèsel Fix");
        status.setBackgroundColor(Color.BLACK); status.setTextColor(Color.YELLOW); status.setPadding(12,12,12,12);
        main.addView(status, new LinearLayout.LayoutParams(-1, -2));
        LinearLayout bar = new LinearLayout(this); bar.setOrientation(LinearLayout.HORIZONTAL); bar.setBackgroundColor(Color.parseColor("#E8F5E9")); bar.setPadding(8,8,8,8);
        deviceSpinner = new Spinner(this); bar.addView(deviceSpinner, new LinearLayout.LayoutParams(0, -2, 1f));
        Button btnScan = new Button(this); btnScan.setText("SCAN APARÈY YO"); btnScan.setTextSize(10); btnScan.setBackgroundColor(Color.parseColor("#4CAF50")); btnScan.setTextColor(Color.WHITE);
        btnScan.setOnClickListener(v->checkPermissions());
        bar.addView(btnScan, new LinearLayout.LayoutParams(-2, -2));
        Button btnConnect = new Button(this); btnConnect.setText("KONEKTE"); btnConnect.setTextSize(10); btnConnect.setBackgroundColor(Color.parseColor("#2196F3")); btnConnect.setTextColor(Color.WHITE);
        btnConnect.setOnClickListener(v->connectSelected());
        bar.addView(btnConnect, new LinearLayout.LayoutParams(-2, -2));
        main.addView(bar, new LinearLayout.LayoutParams(-1, -2));
        webView = new WebView(this);
        main.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1f));
        Button btnExit = new Button(this); btnExit.setText("SOTI NET - FEMEN"); btnExit.setBackgroundColor(Color.RED); btnExit.setTextColor(Color.WHITE);
        main.addView(btnExit, new LinearLayout.LayoutParams(-1, 100));
        btnExit.setOnClickListener(v->{ try{if(btSocket!=null)btSocket.close();}catch(Exception e){} finishAffinity(); System.exit(0); });
        setContentView(main);

        WebSettings s = webView.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setAllowFileAccess(true); s.setAllowUniversalAccessFromFileURLs(true); s.setAllowFileAccessFromFileURLs(true);
        webView.addJavascriptInterface(new AndroidPrinter(), "AndroidPrinter");

        // SA KI PI ENPÒTAN - INJECTION KI FÒSE SUNMI SDK ITILIZE BLUETOOTH
        webView.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                String js = "(function(){ " +
                " console.log('V38 injection active'); " +
                " window.AndroidPrinterReady = true; " +
                // Fòse tout fonksyon enprime yo rele AndroidPrinter
                " var originalPrint = window.printText || window.printFich || null; " +
                " window.printViaBluetooth = function(t){ if(window.AndroidPrinter){ window.AndroidPrinter.printText(t); return true; } return false; }; " +
                // Override Sunmi - si JS eseye enprime ak Sunmi, nou voye l nan Bluetooth
                " if(window.sunmiPrinter){ window.sunmiPrinter.printText = function(t){ return window.printViaBluetooth(t); }; } " +
                " window.SunmiPrint = function(t){ return window.printViaBluetooth(t); }; " +
                " window.BTPrint = function(t){ return window.printViaBluetooth(t); }; " +
                // Chanje tèks BT: Pa konekte -> Konekte si nou konekte
                " setInterval(function(){ " +
                " try{ " +
                " if(window.AndroidPrinter && window.AndroidPrinter.isConnected()){ " +
                " var els = document.body.innerHTML; " +
                " if(els.includes('Pa konekte')){ " +
                " document.body.innerHTML = document.body.innerHTML.replace(/BT:\\s*Pa konekte/g, 'BT: Konekte '+window.AndroidPrinter.getDeviceName()).replace(/Binding\\.\\./g, 'Konekte'); " +
                " } " +
                " } " +
                " }catch(e){} " +
                " }, 1000); " +
                "})();";
                view.evaluateJavascript(js, null);
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
        checkPermissions();
    }
}

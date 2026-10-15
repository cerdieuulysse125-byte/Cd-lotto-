package com.cdlotto.app;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
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

        // Layout prensipal
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // WebView pran 90% ekran
        webView = new WebView(this);
        LinearLayout.LayoutParams webParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f);
        mainLayout.addView(webView, webParams);

        // ===== BOUTON SÒTI - 100% NAN JAVA =====
        Button btnExit = new Button(this);
        btnExit.setText("⬛ SÒTI NÈT - FÈMEN APP LA");
        btnExit.setBackgroundColor(Color.parseColor("#D32F2F")); // Wouj fonse
        btnExit.setTextColor(Color.WHITE);
        btnExit.setTextSize(18);
        btnExit.setAllCaps(false);
        btnExit.setPadding(20, 30, 20, 30);
        LinearLayout.LayoutParams exitParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        exitParams.setMargins(10, 10, 10, 10);
        mainLayout.addView(btnExit, exitParams);

        // Klike pou sòti nèt
        btnExit.setOnClickListener(v -> {
            Toast.makeText(this, "Ap fèmen...", Toast.LENGTH_SHORT).show();
            finishAndRemoveTask();
            finishAffinity();
            System.exit(0);
        });

        setContentView(mainLayout);

        // Permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ActivityCompat.requestPermissions(this, new String[]{
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.ACCESS_FINE_LOCATION
            }, 1);
        }

        // WebView config - REGLE "Chwazi Tiraj"
        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true); // <--- SA KI SOVE TIRAJ YO
        ws.setDatabaseEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowUniversalAccessFromFileURLs(true);
        ws.setCacheMode(WebSettings.LOAD_NO_CACHE);
        ws.setJavaScriptCanOpenWindowsAutomatically(true);

        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new AppInterface(), "AndroidPrinter");

        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        webView.loadUrl("file:///android_asset/index.html");
    }

    public class AppInterface {
        @JavascriptInterface
        public void printText(String data) { runOnUiThread(() -> universalPrint(data)); }
        @JavascriptInterface
        public void print(String data) { printText(data); }
        @JavascriptInterface
        public void exitApp() { runOnUiThread(() -> { finishAndRemoveTask(); finishAffinity(); System.exit(0); }); }
        @JavascriptInterface
        public void sorti() { exitApp(); }
    }

    private void universalPrint(String data) {
        try {
            if (bluetoothAdapter == null) return;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) return;

            boolean printed = false;
            for (BluetoothDevice device : bluetoothAdapter.getBondedDevices()) {
                String name = device.getName() != null ? device.getName().toLowerCase() : "";
                if (name.contains("58") || name.contains("print") || name.contains("pos") || name.contains("mtp")) {
                    if (printViaBluetooth(device, data)) { printed = true; break; }
                }
            }
            if (!printed && !bluetoothAdapter.getBondedDevices().isEmpty()) {
                BluetoothDevice first = bluetoothAdapter.getBondedDevices().iterator().next();
                printViaBluetooth(first, data);
            }
        } catch (Exception e) {
            Toast.makeText(this, "Erè: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private boolean printViaBluetooth(BluetoothDevice device, String data) {
        try {
            UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
            BluetoothSocket socket = device.createRfcommSocketToServiceRecord(uuid);
            socket.connect();
            OutputStream os = socket.getOutputStream();
            os.write(data.getBytes("UTF-8"));
            os.write("\n\n\n".getBytes());
            os.write(new byte[]{0x1D, 0x56, 0x00});
            os.flush(); os.close(); socket.close();
            Toast.makeText(this, "Enprime: " + device.getName(), Toast.LENGTH_SHORT).show();
            return true;
        } catch (Exception e) { return false; }
    }
}

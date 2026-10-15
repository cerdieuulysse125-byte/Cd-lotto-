package com.cdlotto.app;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;

public class MainActivity extends Activity {
    private WebView webView;
    private TextView status;
    private BluetoothSocket btSocket;
    private OutputStream btOutput;
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public class AndroidPrinter {
        @JavascriptInterface
        public void printText(String text) {
            runOnUiThread(() -> {
                try {
                    status.setText("AP ENPRIME... " + text.length() + " karaktè");
                    if (btSocket == null || !btSocket.isConnected()) {
                        connectToPrinter();
                    }
                    if (btOutput != null) {
                        // ESC/POS - init + text + cut
                        btOutput.write(new byte[]{0x1B, 0x40}); // init
                        btOutput.write(text.getBytes("UTF-8"));
                        btOutput.write(new byte[]{0x0A, 0x0A, 0x0A, 0x1D, 0x56, 0x01}); // feed + cut
                        btOutput.flush();
                        status.setText("✅ ENPRIME FÈT!");
                        Toast.makeText(MainActivity.this, "Enprime!", Toast.LENGTH_SHORT).show();
                    } else {
                        status.setText("❌ Pa konekte - Chèche enprimant...");
                        connectToPrinter();
                    }
                } catch (Exception e) {
                    status.setText("❌ ERÈ ENPRIM: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public boolean isConnected() {
            return btSocket != null && btSocket.isConnected();
        }

        @JavascriptInterface
        public String getStatus() {
            if (btSocket != null && btSocket.isConnected()) return "Konekte";
            return "Pa konekte";
        }
    }

    private void connectToPrinter() {
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter == null) { status.setText("❌ Pa gen Bluetooth"); return; }
            if (!adapter.isEnabled()) adapter.enable();
            Set<BluetoothDevice> devices = adapter.getBondedDevices();
            for (BluetoothDevice d : devices) {
                String name = d.getName();
                if (name != null && (name.toLowerCase().contains("print") || name.toLowerCase().contains("58") || name.toLowerCase().contains("80") || name.toLowerCase().contains("mpos") || name.toLowerCase().contains("bluetooth"))) {
                    status.setText("🔍 Konekte ak: " + name);
                    btSocket = d.createRfcommSocketToServiceRecord(MY_UUID);
                    btSocket.connect();
                    btOutput = btSocket.getOutputStream();
                    status.setText("✅ Konekte ak: " + name);
                    return;
                }
            }
            // si pa jwenn non, pran premye aparèy la
            if (!devices.isEmpty()) {
                BluetoothDevice d = devices.iterator().next();
                btSocket = d.createRfcommSocketToServiceRecord(MY_UUID);
                btSocket.connect();
                btOutput = btSocket.getOutputStream();
                status.setText("✅ Konekte ak: " + d.getName());
            }
        } catch (Exception e) {
            status.setText("❌ Koneksyon echwe: " + e.getMessage());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout main = new LinearLayout(this);
        main.setOrientation(LinearLayout.VERTICAL);
        
        status = new TextView(this);
        status.setText("CD LOTTO V34 INIVESEL - Pare");
        status.setBackgroundColor(Color.BLACK);
        status.setTextColor(Color.YELLOW);
        status.setPadding(15,15,15,15);
        status.setTextSize(12);
        main.addView(status, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        
        webView = new WebView(this);
        main.addView(webView, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        
        Button btn = new Button(this);
        btn.setText("SOTI NET - FEMEN");
        btn.setBackgroundColor(Color.RED);
        btn.setTextColor(Color.WHITE);
        btn.setTextSize(18);
        main.addView(btn, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 150));
        btn.setOnClickListener(v -> { try { if(btSocket!=null) btSocket.close(); } catch(Exception e){} finishAffinity(); System.exit(0); });
        
        setContentView(main);
        
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        
        // SA KI FÈ L INIVESEL LA
        webView.addJavascriptInterface(new AndroidPrinter(), "AndroidPrinter");
        
        webView.loadUrl("file:///android_asset/index.html");
    }
}

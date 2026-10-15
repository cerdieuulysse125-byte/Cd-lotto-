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
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private WebView webView;
    private TextView status;
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
                        status.setText("🔌 Ap konekte...");
                        autoConnect();
                    }
                    if (btOutput != null) {
                        btOutput.write(new byte[]{0x1B, 0x40});
                        btOutput.write(text.getBytes("UTF-8"));
                        btOutput.write(new byte[]{0x0A, 0x0A, 0x0A, 0x1D, 0x56, 0x01});
                        btOutput.flush();
                        status.setText("✅ ENPRIME OK - " + (lastDevice!=null?lastDevice.getName():""));
                        Toast.makeText(MainActivity.this, "✅ Enprime!", Toast.LENGTH_SHORT).show();
                    } else {
                        status.setText("❌ Pa gen enprimant - Pè youn nan Bluetooth");
                        Toast.makeText(MainActivity.this, "Pè enprimant Bluetooth nan Settings", Toast.LENGTH_LONG).show();
                    }
                } catch (Exception e) { status.setText("❌ ERÈ: " + e.getMessage()); }
            });
        }

        @JavascriptInterface
        public String scanBluetooth() {
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if (adapter == null) return "[]";
                Set<BluetoothDevice> devices = adapter.getBondedDevices();
                JSONArray arr = new JSONArray();
                for (BluetoothDevice d : devices) {
                    JSONObject o = new JSONObject();
                    o.put("name", d.getName());
                    o.put("address", d.getAddress());
                    arr.put(o);
                }
                return arr.toString();
            } catch (Exception e) { return "[]"; }
        }

        @JavascriptInterface
        public boolean connectTo(String address) {
            try {
                BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                BluetoothDevice dev = adapter.getRemoteDevice(address);
                btSocket = dev.createRfcommSocketToServiceRecord(MY_UUID);
                btSocket.connect();
                btOutput = btSocket.getOutputStream();
                lastDevice = dev;
                runOnUiThread(() -> status.setText("✅ Konekte: " + dev.getName()));
                return true;
            } catch (Exception e) {
                runOnUiThread(() -> status.setText("❌ Koneksyon echwe: " + e.getMessage()));
                return false;
            }
        }

        @JavascriptInterface public boolean isConnected() { return btSocket!=null && btSocket.isConnected(); }
        @JavascriptInterface public String getStatus() { return btSocket!=null && btSocket.isConnected() ? "Konekte: "+lastDevice.getName() : "Pa konekte"; }
    }

    private void autoConnect() {
        try {
            BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
            if (adapter==null) return;
            if (!adapter.isEnabled()) adapter.enable();
            Set<BluetoothDevice> devices = adapter.getBondedDevices();
            for (BluetoothDevice d : devices) {
                String n = d.getName()!=null?d.getName().toLowerCase():"";
                if (n.contains("print")||n.contains("58")||n.contains("80")||n.contains("mpos")||n.contains("pos")||n.contains("blue")) {
                    btSocket = d.createRfcommSocketToServiceRecord(MY_UUID);
                    btSocket.connect(); btOutput = btSocket.getOutputStream(); lastDevice=d;
                    status.setText("✅ Auto-konekte: "+d.getName()); return;
                }
            }
        } catch (Exception e) {}
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout main = new LinearLayout(this); main.setOrientation(LinearLayout.VERTICAL);
        status = new TextView(this);
        status.setText("CD LOTTO V35 INIVÈSÈL - Bluetooth Pare");
        status.setBackgroundColor(Color.BLACK); status.setTextColor(Color.YELLOW); status.setPadding(15,15,15,15); status.setTextSize(11);
        main.addView(status, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        webView = new WebView(this);
        main.addView(webView, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        Button btn = new Button(this); btn.setText("SOTI NET - FEMEN"); btn.setBackgroundColor(Color.RED); btn.setTextColor(Color.WHITE); btn.setTextSize(18);
        main.addView(btn, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 130));
        btn.setOnClickListener(v -> { try { if(btSocket!=null) btSocket.close(); } catch(Exception e){} finishAffinity(); System.exit(0); });
        setContentView(main);
        WebSettings s = webView.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setAllowFileAccess(true); s.setAllowUniversalAccessFromFileURLs(true); s.setAllowFileAccessFromFileURLs(true); s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.addJavascriptInterface(new AndroidPrinter(), "AndroidPrinter");
        webView.loadUrl("file:///android_asset/index.html");
    }
}

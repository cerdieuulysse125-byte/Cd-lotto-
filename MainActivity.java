package com.cdlotto.app;
import android.app.Activity; import android.os.Bundle; import android.widget.*;
import android.view.*; import android.graphics.Color; import android.util.Log;
import java.util.*; import java.lang.reflect.Method;
import java.text.SimpleDateFormat; import java.util.Date;

public class MainActivity extends Activity {
    LinearLayout mainLayout, betsLayout;
    EditText serialInput, passInput;
    TextView statusText, totalText;
    List<CheckBox> tirajChecks = new ArrayList<>();
    List<BetRow> betRows = new ArrayList<>();
    String currentSerial = ""; String lastTicket = "";
    Object sunmiService = null; boolean sunmiReady = false;
    String[] TIRAJ = {"Borlette Matin","La Suerte 12:30","Haiti 14h","Borlette Soir 18h","FL midi","FL soir","NY soir","GA soir"};
    class BetRow { EditText boul, mise; }
    @Override protected void onCreate(Bundle b) { super.onCreate(b); showLogin(); initSunmi(); }
    void showLogin() {
        mainLayout = new LinearLayout(this); mainLayout.setOrientation(1); mainLayout.setBackgroundColor(Color.parseColor("#eef2f7")); mainLayout.setPadding(20,60,20,20);
        TextView title = new TextView(this); title.setText("C&D VERITE LOTTO\nV28 NATIVE SILENT\nSAN HTML - SAN CHROME"); title.setTextSize(18); title.setGravity(17); title.setTextColor(Color.parseColor("#0a4a2e")); title.setPadding(0,0,0,30); mainLayout.addView(title);
        serialInput = new EditText(this); serialInput.setHint("Serial"); serialInput.setPadding(20,20,20,20); mainLayout.addView(serialInput);
        passInput = new EditText(this); passInput.setHint("Modpas"); passInput.setInputType(129); passInput.setPadding(20,20,20,20); LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1,-2); lp.topMargin=15; mainLayout.addView(passInput, lp);
        Button loginBtn = new Button(this); loginBtn.setText("KONEKTE NATIVE"); loginBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); loginBtn.setTextColor(Color.parseColor("#d4af37")); LinearLayout.LayoutParams lp2 = new LinearLayout.LayoutParams(-1,120); lp2.topMargin=20; mainLayout.addView(loginBtn, lp2); loginBtn.setOnClickListener(v->doLogin());
        statusText = new TextView(this); statusText.setText("Sunmi:..."); statusText.setGravity(17); statusText.setPadding(0,20,0,0); mainLayout.addView(statusText); setContentView(mainLayout);
    }
    void doLogin() { String s = serialInput.getText().toString().trim(); if(s.isEmpty()){ Toast.makeText(this,"Mete Serial",0).show(); return; } currentSerial=s; showMain(); }
    void showMain() {
        mainLayout = new LinearLayout(this); mainLayout.setOrientation(1); mainLayout.setBackgroundColor(Color.parseColor("#eef2f7"));
        ScrollView scroll = new ScrollView(this); LinearLayout content = new LinearLayout(this); content.setOrientation(1); content.setPadding(10,10,10,100);
        TextView h = new TextView(this); h.setText("C&D V28 NATIVE | "+currentSerial+" | SILENT SAN DYALOG"); h.setBackgroundColor(Color.parseColor("#0a4a2e")); h.setTextColor(Color.parseColor("#d4af37")); h.setPadding(15,15,15,15); content.addView(h);
        TextView tTitle = new TextView(this); tTitle.setText("1- TIRAJ"); tTitle.setTextSize(16); tTitle.setPadding(0,15,0,5); content.addView(tTitle);
        LinearLayout tirajGrid = new LinearLayout(this); tirajGrid.setOrientation(1);
        for(String t: TIRAJ){ CheckBox cb = new CheckBox(this); cb.setText(t); tirajChecks.add(cb); tirajGrid.addView(cb); } content.addView(tirajGrid);
        TextView bTitle = new TextView(this); bTitle.setText("2- BOUL / MIZ"); bTitle.setTextSize(16); bTitle.setPadding(0,20,0,10); content.addView(bTitle);
        betsLayout = new LinearLayout(this); betsLayout.setOrientation(1); content.addView(betsLayout);
        Button addBtn = new Button(this); addBtn.setText("+ Liy"); content.addView(addBtn); addBtn.setOnClickListener(v->addBetRow());
        totalText = new TextView(this); totalText.setText("Total $0"); totalText.setBackgroundColor(Color.parseColor("#0a4a2e")); totalText.setTextColor(Color.parseColor("#d4af37")); totalText.setPadding(15,15,15,15); totalText.setTextSize(18); LinearLayout.LayoutParams tlp = new LinearLayout.LayoutParams(-1,-2); tlp.topMargin=15; content.addView(totalText, tlp);
        LinearLayout btnRow = new LinearLayout(this); btnRow.setOrientation(0);
        Button sellBtn = new Button(this); sellBtn.setText("VANN SILENT"); sellBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); sellBtn.setTextColor(Color.parseColor("#d4af37")); LinearLayout.LayoutParams blp = new LinearLayout.LayoutParams(0,-2,1); btnRow.addView(sellBtn, blp);
        Button reprintBtn = new Button(this); reprintBtn.setText("RE-PRINT"); LinearLayout.LayoutParams blp2 = new LinearLayout.LayoutParams(0,-2,1); blp2.leftMargin=10; btnRow.addView(reprintBtn, blp2);
        content.addView(btnRow); sellBtn.setOnClickListener(v->sellTicket()); reprintBtn.setOnClickListener(v->{ if(!lastTicket.isEmpty()) printSilent(lastTicket); });
        addBetRow(); addBetRow(); scroll.addView(content); mainLayout.addView(scroll); setContentView(mainLayout);
    }
    void addBetRow() {
        LinearLayout row = new LinearLayout(this); row.setOrientation(0); row.setPadding(0,5,0,5);
        EditText boul = new EditText(this); boul.setHint("Boul"); boul.setInputType(2); LinearLayout.LayoutParams p1 = new LinearLayout.LayoutParams(0,-2,1); row.addView(boul, p1);
        EditText mise = new EditText(this); mise.setHint("$"); mise.setInputType(2); LinearLayout.LayoutParams p2 = new LinearLayout.LayoutParams(0,-2,1); p2.leftMargin=10; row.addView(mise, p2);
        mise.addTextChangedListener(new android.text.TextWatcher(){ public void beforeTextChanged(CharSequence s,int a,int b,int c){} public void onTextChanged(CharSequence s,int a,int b,int c){ updateTotal(); } public void afterTextChanged(android.text.Editable s){ updateTotal(); } });
        BetRow br = new BetRow(); br.boul=boul; br.mise=mise; betRows.add(br); betsLayout.addView(row);
    }
    void updateTotal() { int sum=0; for(BetRow br: betRows){ try{ String m = br.mise.getText().toString(); if(!m.isEmpty()) sum+=Integer.parseInt(m); }catch(Exception e){} } int count=0; for(CheckBox cb: tirajChecks) if(cb.isChecked()) count++; totalText.setText("Total $"+sum+" x "+count+" = $"+(sum*count)); }
    void sellTicket() {
        List<String> sel = new ArrayList<>(); for(CheckBox cb: tirajChecks) if(cb.isChecked()) sel.add(cb.getText().toString());
        if(sel.isEmpty()){ Toast.makeText(this,"Chwazi Tiraj",0).show(); return; }
        StringBuilder betsStr = new StringBuilder(); int total=0;
        for(BetRow br: betRows){ String b = br.boul.getText().toString().trim(); String m = br.mise.getText().toString().trim(); if(!b.isEmpty() &&!m.isEmpty()){ try{ int mi = Integer.parseInt(m); total+=mi; betsStr.append(b).append(" - $").append(m).append("\n"); }catch(Exception e){} } }
        if(betsStr.length()==0){ Toast.makeText(this,"Mete Boul",0).show(); return; }
        int grand = total*sel.size();
        StringBuilder ticket = new StringBuilder();
        ticket.append(center("C&D VERITE LOTTO")).append("\n"); ticket.append(center("V28 NATIVE SILENT")).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(center("Vendeur: "+currentSerial)).append("\n"); ticket.append(center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()))).append("\n"); ticket.append(center("----------------")).append("\n");
        for(String t: sel) ticket.append(center(t)).append("\n"); ticket.append(betsStr.toString()); ticket.append(center("----------------")).append("\n"); ticket.append(center("Total => "+grand+" HTG")).append("\n"); ticket.append(center("Mesi!")).append("\n\n\n\n");
        lastTicket = ticket.toString(); printSilent(lastTicket); Toast.makeText(this,"VANN $"+grand+" SILENT",1).show();
    }
    String center(String s){ int W=32; if(s.length()>=W) return s.substring(0,W); int left=(W-s.length())/2; StringBuilder sb=new StringBuilder(); for(int i=0;i<left;i++) sb.append(" "); sb.append(s); return sb.toString(); }
    void initSunmi(){ try{ Class<?> managerCls = Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager"); java.lang.reflect.Method getInstance = managerCls.getMethod("getInstance"); Object manager = getInstance.invoke(null); Class<?> callbackCls = Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback"); Object callback = java.lang.reflect.Proxy.newProxyInstance(callbackCls.getClassLoader(), new Class[]{callbackCls}, (proxy, method, args)->{ if(method.getName().equals("onConnected")){ sunmiService=args[0]; sunmiReady=true; runOnUiThread(()->{ if(statusText!=null) statusText.setText("Sunmi: SILENT OK - SAN DYALOG"); }); } return null; }); java.lang.reflect.Method init = managerCls.getMethod("init", android.content.Context.class, callbackCls); init.invoke(manager, this, callback); }catch(Exception e){ Log.e("SUNMI","fail "+e.getMessage()); } }
    void printSilent(String txt){ try{ if(sunmiService!=null && sunmiReady){ Method m1 = sunmiService.getClass().getMethod("printText", String.class); Method m2 = sunmiService.getClass().getMethod("lineWrap", int.class); m1.invoke(sunmiService, txt); m2.invoke(sunmiService, 4); return; } }catch(Exception e){ Log.e("PRINT",e.toString()); } Toast.makeText(this, "IMPRIME:\n"+txt, 1).show(); }
}

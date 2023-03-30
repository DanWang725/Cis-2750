import sys;
import io;
import os
import json
import MolDisplay
import molsql
from http.server import HTTPServer, BaseHTTPRequestHandler;

# The port is 51584

database = molsql.Database();
class Handler(BaseHTTPRequestHandler):
  def do_GET(self):
    if self.path == "/":
      f = open("src/index.html", "r")
      css = ""
      s = f.readline()
      while s != "":
        css += s
        #print(s)
        s = f.readline()
      f.close()
      self.send_response( 200 ); # OK

      self.send_header( "Content-type", "text/html" );
      self.send_header( "Content-length", len(css) );
      self.end_headers();

      self.wfile.write( bytes( css, "utf-8" ) );

    else:
      sendReply = False
      mimetype = ""
      print(self.path)
      if self.path.endswith(".css"):
        mimetype = "text/css"
        sendReply = True
      if self.path.endswith(".js"):
        mimetype = "application/javascript"
        sendReply = True
      if self.path.endswith(".json"):
        mimetype = "application/json"
        sendReply = True

      
      if sendReply == True:
        if self.path.endswith(".json"):
          #css = json.dumps(database.getElementsJSON(), indent=4)
          if self.path.endswith("addtest.json"):
            database['Elements'] = ( 2, 'D', 'Deez Nuts', 'FFFFFF', '050505', '020202', 25 );
          css = json.dumps(database.getElementsJSON(), indent=4)
        else:
          f = open("src"+self.path, "r")
          css = ""
          s = f.readline()
          while s != "":
            css += s
            #print(s)
            s = f.readline()
          f.close()

        self.send_response(200)
        self.send_header("Content-type",mimetype)
        self.send_header( "Content-length", len(css) );
        self.end_headers()
        self.wfile.write(bytes(css, "utf-8"))
        return
      
      self.send_response( 418 );
      self.end_headers();
      self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );
  
  def do_POST(self):
    if self.path == "/molecule":
      self.send_response( 200 ); # OK
      
      #send rfile to an iowrapper
      sdfFile = io.TextIOWrapper(self.rfile, 'utf-8', newline = '')
      mol = MolDisplay.Molecule();

      #remove header information
      for x in range(4):
        sdfFile.readline();
      
      #parse file
      mol.parse(sdfFile);
      mol.sort();
      svgString = mol.svg()

      self.send_header( "Content-type", "image/svg+xml" );
      self.send_header( "Content-length", len(svgString) );
      self.end_headers();

      self.wfile.write( bytes( svgString, "utf-8" ) );
    elif self.path.endswith(".json"):
      data = self.rfile.read(int(self.headers['Content-length']));
      gottenData = json.loads(data.decode('utf-8'));
      if self.path == "/element.json":
        database['Elements'] = ('NULL', gottenData['code'], gottenData['name'],
                                gottenData['colour'], gottenData['colour'], gottenData['colour'],
                                gottenData['radius']);
      print(gottenData);
      self.send_response( 418 );
      self.end_headers();
      self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );
    else:
      self.send_response( 418 );
      self.end_headers();
      self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );
  def do_DELETE(self):
    if(self.path == "/element.json"):
      data = self.rfile.read(int(self.headers['Content-length']));
      elementCode = data.decode('utf-8');
      print(elementCode)
      print(f"{elementCode}")
      result, isDatabaseDestroyed = database.deleteEntry('Elements','ELEMENT_CODE',f"'{elementCode}'")
      if(result):
        self.send_response( 200 );
        self.end_headers();
        self.wfile.write( bytes( "Normal", "utf-8" ) );
      else :
        self.send_response( 404 );
        self.end_headers();
        self.wfile.write( bytes( "404: not found", "utf-8" ) );
    else:
      self.send_response( 418 );
      self.end_headers();
      self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );


inputForm = """

""";
httpd = HTTPServer( ( 'localhost', int(sys.argv[1]) ), Handler );
httpd.serve_forever();

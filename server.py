import sys;
import io;
import os
import re
import json
import MolDisplay
import molsql
import random
from http.server import HTTPServer, BaseHTTPRequestHandler;

# The port is 51584

database = molsql.Database();
MolDisplay.radius = database.radius();
MolDisplay.element_name = database.element_name();
MolDisplay.header += database.radial_gradients();
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
      if self.path.endswith(".svg"):
        mimetype = "image/svg+xml"
        sendReply = True
      
      if sendReply == True:
        if self.path.endswith(".json"):
          #css = json.dumps(database.getElementsJSON(), indent=4)
          if self.path.endswith("addtest.json"):
            database['Elements'] = ( 2, 'D', 'Deez Nuts', 'FFFFFF', '050505', '020202', 25 );
          
          if self.path == "/molecule.json":
            css = json.dumps(database.load_allMol(), indent=4)
          else:
            css = json.dumps(database.getElementsJSON(), indent=4)
        elif self.path.endswith(".svg"):
          molecule = re.search('[ \w-]+?(?=\.)', self.path)
          print("Trying to find molecule " + molecule[0])
          if(molecule[0] == "hp"):
            loadedMol = database.load_mol(random.choice( database.load_allMol())['name'])
          else:
            loadedMol = database.load_mol(molecule[0])
          if loadedMol.atom_no == 0:
            self.send_response( 404 );
            self.end_headers();
            self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );
            return
          
          css = loadedMol.svg(nightmare=True)
          
        else:
          f = open("src"+self.path, "r")
          css = ""
          s = f.readline()
          while s != "":
            css += s
            #print(s)
            s = f.readline()
          f.close()

        #print(css)
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
    if self.path.endswith(".sdf"):
      data = self.rfile.read(int(self.headers['Content-length']));
      gottenData = json.loads(data.decode('utf-8'));
      print(gottenData)

      
      #send rfile to an iowrapper
      
      # print(gottenData['name'])
      # print(gottenData['data'])
        
        #print("ENDLLINE")
      if not database.add_molecule_str(gottenData['name'], gottenData['data']):
        self.send_response( 415 ); # OK
        self.end_headers()

      self.send_response( 200 ); # OK
      # mol = MolDisplay.Molecule();

      # #remove header information
      # for x in range(4):
      #   sdfFile.readline();
      
      # #parse file
      # mol.parse(sdfFile);
      # mol.sort();
      #svgString = mol.svg()

      self.end_headers();

    elif self.path.endswith(".json"):
      data = self.rfile.read(int(self.headers['Content-length']));
      gottenData = json.loads(data.decode('utf-8'));
      if self.path == "/upload/element.json":
        database['Elements'] = ('NULL', gottenData['code'], gottenData['name'],
                                gottenData['colour'], gottenData['colour'], gottenData['colour'],
                                gottenData['radius']);
      #print(gottenData);
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
    elif self.path == "/molecule.json":
      data = self.rfile.read(int(self.headers['Content-length']));
      molName = data.decode('utf-8');
      print(molName)
      print(f"{molName}")
      result = database.delete_molecule(f"{molName}")
      if(result):
        self.send_response( 200 );
        self.end_headers();
        self.wfile.write( bytes( "Normal", "utf-8" ) );
      else :
        self.send_response( 404 );
        self.end_headers();
        self.wfile.write( bytes( "404: not found", "utf-8" ) )
    else:
      self.send_response( 418 );
      self.end_headers();
      self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );


inputForm = """

""";
httpd = HTTPServer( ( 'localhost', int(sys.argv[1]) ), Handler );
httpd.serve_forever();

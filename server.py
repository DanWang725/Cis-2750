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
      requiresFile = False
      mimetype = ""
      css = ''
      print(self.path)
      if self.path.endswith(".css"):
        mimetype = "text/css"
        sendReply = True
        requiresFile = True
      if self.path.endswith(".js"):
        mimetype = "application/javascript"
        sendReply = True
        requiresFile = True
      if self.path.endswith(".json"):
        mimetype = "application/json"
        sendReply = True
      if self.path.endswith(".svg"):
        mimetype = "image/svg+xml"
        sendReply = True
      if self.path.endswith(".ico"):
        mimetype = "image/vnd.microsoft.icon"
        sendReply = True
        requiresFile = True
      
      if sendReply == True:
        if self.path.endswith(".json"):
          #css = json.dumps(database.getElementsJSON(), indent=4
          if self.path == "/molecule.json":
            css = json.dumps(database.load_allMol(), indent=4)
          else:
            css = json.dumps(database.getElementsJSON(), indent=4)
        elif self.path.endswith(".svg"):
          molecule = re.search('[ \w-]+?(?=\.)', self.path)
          print("Trying to find molecule " + molecule[0])

          if(self.path.startswith("/molecule/rotation/")):
            coords = self.path.split('.');
            print(coords)
            if not hasattr(self, 'cache'):
              self.cache = ''
              self.cachedMolName = 'none'
              
            if self.cachedMolName != molecule[0]:
              loadedMol = database.load_mol(molecule[0])
              self.cache = MolDisplay.Rotation()
              self.cache.loadMol(loadedMol)
              self.cachedMolName = molecule[0]
            css = self.cache.getRotation(int(coords[1]), int(coords[2]), int(coords[3]))
          elif(self.path.startswith("/molecule/all/rotation/")):
            if not hasattr(self, 'cache'):
              self.cache = ''
              self.cachedMolName = 'none'

            if self.cachedMolName != molecule[0]:
              loadedMol = database.load_mol(molecule[0])
              self.cache = MolDisplay.Rotation()
              self.cache.loadMol(loadedMol)
              self.cachedMolName = molecule[0]

            newContent = {}
            newContent['x'] = self.cache.x;
            newContent['y'] = self.cache.y;
            newContent['z'] = self.cache.z;
            css = json.dumps(newContent, indent=4);
            
          elif(molecule[0] == "hp"):
            loadedMol = database.load_mol(random.choice( database.load_allMol())['name'])
          else:
            loadedMol = database.load_mol(molecule[0])

          # if loadedMol.atom_no == 0:
          #   self.send_response( 404 );
          #   self.end_headers();
          #   self.wfile.write( bytes( "418: IT TEAPOTTIN TIME, PROCEEDS TO TEAPOT ALL OVER YOU", "utf-8" ) );
          #   return
          if css == '':
            css = loadedMol.svg(nightmare=True)
          
        else:
          if(self.path.endswith(".ico")):
            f = open("src"+self.path, "rb")
          else:
            f = open("src"+self.path, "r")
            
          f.seek(0, os.SEEK_END);
          length = f.tell()
          f.seek(0, os.SEEK_SET);

          css = ""
          css = f.read(length)
          # while s != "":
          #   css += s
          #   #print(s)
          #   s = f.readline()
          f.close()

        #print(css)
        self.send_response(200)
        self.send_header("Content-type",mimetype)
        self.send_header( "Content-length", len(css) );
        self.end_headers()

        if(self.path.endswith(".ico")):
          self.wfile.write(css)
        else:
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
                                gottenData['colour1'], gottenData['colour2'], gottenData['colour3'],
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

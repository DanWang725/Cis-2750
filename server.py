import sys;
import io;
import os
import MolDisplay
from http.server import HTTPServer, BaseHTTPRequestHandler;

# The port is 51584

class Handler(BaseHTTPRequestHandler):
  def do_GET(self):
    if self.path == "/":
      self.send_response( 200 ); # OK

      self.send_header( "Content-type", "text/html" );
      self.send_header( "Content-length", len(inputForm) );
      self.end_headers();

      self.wfile.write( bytes( inputForm, "utf-8" ) );

    else:
      sendReply = False
      mimetype = ""
      print(self.path)
      if self.path.endswith(".css"):
        mimetype = "text/css"
        sendReply = True
      if self.path.endswith(".js"):
        mimetype = "text/babel"
        sendReply = True
      
      if sendReply == True:
        f = open("src"+self.path, "r")
        self.send_response(200)
        css = ""
        s = f.readline()
        while s != "":
          css += s
          #print(s)
          s = f.readline()

        self.send_header("Content-type",mimetype)
        self.send_header( "Content-length", len(css) );
        self.end_headers()
        self.wfile.write(bytes(css, "utf-8"))
        f.close()
        return
      
      self.send_response( 404 );
      self.end_headers();
      self.wfile.write( bytes( "404: not found", "utf-8" ) );
  
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
    else:
      self.send_response( 404 );
      self.end_headers();
      self.wfile.write( bytes( "404: not found", "utf-8" ) );

inputForm = """
<html>
  <head>
    <title> File Upload </title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
      <div id="root"></div>
        <script src="https://unpkg.com/react@latest/umd/react.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@latest/umd/react-dom.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js" crossorigin="anonymous"></script>
    <script type="text/babel">
        let createElement = React.createElement

        let rootElement = (
          <div className='ContactList'>
            <h1 className='ContactList-title'>Contacts</h1>
            <div>
              <div className='Contact'>
                <div className='Contact-avatar'>JN</div>
                <span className='Contact-name'>Myron Myron</span>
                <a href='mailto:mladyjen@uoguleph.ca' className='Contact-link'>mladyjen@uoguelph.ca</a>
              </div>
              <div className='Contact'>
                <div className='Contact-avatar'>DW</div>
                <span className='Contact-name'>Myron Myron</span>
                <a href='mailto:dwang11@uoguleph.ca' className='Contact-link'>dwang11@uoguelph.ca</a>
              </div>
            </div>
          </div>
        )

        // The `ReactDOM` variable is set by the second `<script>` tag
        // in the above HTML file
        ReactDOM.render(rootElement, document.getElementById('root'))

    </script>
    <h1> File Upload </h1>
    <form action="molecule" enctype="multipart/form-data" method="post">
      <p>
        <input type="file" id="sdf_file" name="filename"/>
      </p>
      <p>
        <input type="submit" value="Upload"/>
      </p>
    </form>
  </body>
</html>
""";

httpd = HTTPServer( ( 'localhost', int(sys.argv[1]) ), Handler );
httpd.serve_forever();

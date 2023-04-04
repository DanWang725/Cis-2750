import molecule
import math
import copy
header = """<svg version="1.1" width="{x:d}" height="{y:d}"
 xmlns="http://www.w3.org/2000/svg">""";
footer = """</svg>""";
offsetx = 1000;
offsety = 1000;

class Atom:
    """
    A wrapper class for an atom
    """
    def __init__(self, c_atom):
        self.atom = c_atom;
        self.z = c_atom.z
    def __str__(self):
        return 'Atom: '+  str(self.atom.element) +' '+ str(self.atom.x) +' '+ str(self.atom.y) +' '+ str(self.z);
    def svg(self):
        if self.atom.element in radius:
            rad = radius[self.atom.element];
        else:
            rad = 40
            print("can't find", self.atom.element)

        if self.atom.element in element_name:
            fill = element_name[self.atom.element]
        else:
            fill= 'default'
        return '<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:d}" fill="url(#{s})"/>\n'.format(
            x = self.atom.x*100 + offsetx, y = self.atom.y*100 + offsety, r = rad, s = fill)
class Bond:
    """
    A wrapper class for a bond url(#atomname)
    """
    def __init__(self, c_bond):
        self.bond = c_bond
        self.z = c_bond.z
    def __str__(self):
        return str(self.bond.a1) +' '+ str(self.bond.a2) +' '+ str(self.bond.epairs) +' '+ str(self.bond.x1) +' '+ str(self.bond.y1) +' '+ str(self.bond.x2) +' '+ str(self.bond.y2) +' '+ str(self.bond.len) +' '+ str(self.bond.dx) +' '+ str(self.bond.dy)
    def svg(self):
        aBond = self.bond
        x1 = aBond.x1 * 100 + offsetx
        x2 = aBond.x2 * 100 + offsetx
        y1 = aBond.y1 * 100 + offsety
        y2 = aBond.y2 * 100 + offsety
        dx = aBond.dx * 10
        dy = aBond.dy * 10
        return '<polygon points="{:.2f},{:.2f} {:.2f},{:.2f} {:.2f},{:.2f} {:.2f},{:.2f}" fill="green"/>\n'.format(
            x1 + dy, y1 - dx, x1 - dy, y1 + dx, x2 - dy, y2 + dx, x2 + dy, y2 - dx)
    def svg2(self, position):
        atom1 = Atom(molecule.bondGetA1(self.bond)).atom;
        atom2 = Atom(molecule.bondGetA2(self.bond)).atom;
        aBond = self.bond;
        length = math.sqrt((atom2.x - atom1.x)**2 + (atom2.y-atom1.y)**2 + (atom2.z - atom1.z)**2) #length using x,y,z
        lengthFlat = math.sqrt((atom2.x - atom1.x)**2 + (atom2.y-atom1.y)**2)
        projLen = length - abs(atom2.z - atom1.z);
        if(lengthFlat == 0):
            lengthFlat = 0.001
        domain = (atom1.x - atom2.x)/lengthFlat
        angle = math.asin(domain);

        angleInDegrees = math.degrees(-angle);

        if(length == 0):
            length = 0.001
        zAxisRatio = projLen/length;
        
        sinPart = zAxisRatio*math.sin(angle)*0.9;
        cosPart = zAxisRatio*math.cos(angle)*0.9;
        if(atom1.y < atom2.y):
            cosPart = -cosPart;
            if(angleInDegrees > 0):
                    angleInDegrees = 180 - angleInDegrees
            else:
                angleInDegrees = 360 - angleInDegrees

        width = 15;

        if atom1.element in radius:
            radiusA1 = radius[atom1.element];
        else:
            radiusA1 = 40

        if atom2.element in radius:
            radiusA2 = radius[atom2.element];
        else:
            radiusA2 = 40

        x1 = aBond.x1 * 100 + offsetx - radiusA1*sinPart
        x2 = aBond.x2 * 100 + offsetx + radiusA2*sinPart
        y1 = aBond.y1 * 100 + offsety - radiusA1*cosPart
        y2 = aBond.y2 * 100 + offsety + radiusA2*cosPart
        dx = aBond.dx * width ;
        dy = aBond.dy * width ;
        if(atom1.z < atom2.z):
            bX = x1;
            bY = y1;
        else:
            bX = x2;
            bY = y2

        svgString = """  <linearGradient id="bond{:d}" x1="{:.2f}" y1="{:.2f}" x2="{:.2f}" y2="{:.2f}" gradientUnits="userSpaceOnUse">""".format(
            position, bX - dy, bY + dx, bX + dy, bY - dx)
        
        if(angleInDegrees > -45 and angleInDegrees < 135):
            svgString += """<stop offset="0%" stop-color="#252525" />
                            <stop offset="50%" stop-color="#454545" />
                            <stop offset="75%" stop-color="#606060" />
                            <stop offset="100%" stop-color="#454545" />
                            </linearGradient>\n"""
        else:
            svgString += """<stop offset="0%" stop-color="#454545" />
                            <stop offset="25%" stop-color="#606060" />
                            <stop offset="50%" stop-color="#454545" />
                            <stop offset="100%" stop-color="#252525" />
                            </linearGradient>\n"""
        svgString += """  <linearGradient id="cap{:d}" x1="{:.2f}" y1="{:.2f}" x2="{:.2f}" y2="{:.2f}" gradientUnits="userSpaceOnUse" gradientTransform="rotate({:.2f},{:.2f},{:.2f})">""".format(
            position, bX - dy, bY + dx, bX + dy, bY - dx, -angleInDegrees, bX, bY)
        
        if(angleInDegrees > -45 and angleInDegrees < 135):
            svgString += """<stop offset="0%" stop-color="#252525" />
                            <stop offset="50%" stop-color="#454545" />
                            <stop offset="75%" stop-color="#606060" />
                            <stop offset="100%" stop-color="#454545" />
                            </linearGradient>\n"""
        else:
            svgString += """<stop offset="0%" stop-color="#454545" />
                            <stop offset="25%" stop-color="#606060" />
                            <stop offset="50%" stop-color="#454545" />
                            <stop offset="100%" stop-color="#252525" />
                            </linearGradient>\n"""
        svgString += '<polygon points="{:.2f},{:.2f} {:.2f},{:.2f} {:.2f},{:.2f} {:.2f},{:.2f}" fill="url(#bond{:d})"/>\n'.format(
            x1 + dy, y1 - dx, x1 - dy, y1 + dx, x2 - dy, y2 + dx, x2 + dy, y2 - dx, position)
        
        svgString += '<ellipse cx="{:.2f}" cy="{:.2f}" rx="{:.2f}" ry="{:.2f}" transform="rotate({:.2f},{:.2f},{:.2f})" fill="url(#cap{:d})" />\n'.format(
            bX, bY, width, width*(1-zAxisRatio**2), angleInDegrees, bX, bY, position)
        
        return svgString

class Molecule(molecule.molecule):
    """
    A wrapper class for a molecule
    Contains methods for parsing an sdf file, and generating svg representation
    """
    def importMoleculeMolecule(self, mol):
        # mol = molecule.molecule(mol)
        for x in range(mol.atom_no):
            atom = mol.get_atom(x)
            self.append_atom(atom.element, atom.x, atom.y, atom.z);
        for x in range(mol.bond_no):
            bond = mol.get_bond(x)
            self.append_bond(bond.a1, bond.a2, bond.epairs);

    def __str__(self):
        string = ""
        for a in range(self.atom_no):
            string += str(Atom(self.get_atom(a))) + '\n';
        for b in range(self.bond_no):
            string += str(Bond(self.get_bond(b))) + '\n';
        return string
    
    def svg(self, nightmare=False, rotation=False):
        self.sort()
        """
        Generates svg tags to represent the molecule
        """
        atomIdx = 0
        bondIdx = 0
        
        global offsetx, offsety

        if(rotation):
            if not hasattr(self, 'max_length'):
                self.max_length = 0
                for a in range(self.atom_no):
                    atom = Atom(self.get_atom(a));
                    self.max_length = max(math.sqrt((atom.atom.x) ** 2 + (atom.atom.y) ** 2 + (atom.atom.z) ** 2), self.max_length);
            height = math.ceil(self.max_length * 2)*100 + 150
            width = math.ceil(self.max_length * 2)*100 + 150
        else:
            statsX = {'max':0.0,'min':0.0}
            statsY = {'max':0.0, 'min':0.0}
            for a in range(self.atom_no):
                atom = Atom(self.get_atom(a));
                statsX['max'] = max(statsX['max'], atom.atom.x)
                statsY['max'] = max(statsY['max'], atom.atom.y)
                statsX['min'] = min(statsX['min'], atom.atom.x)
                statsY['min'] = min(statsY['min'], atom.atom.y)

            height = math.ceil(statsY['max']-statsY['min'])*100 + 300
            width = math.ceil(statsX['max']-statsX['min'])*100 + 300
        
        offsetx = math.ceil((width-150)/2)
        offsety = math.ceil((height-150)/2)
        # print(f"offsetx {offsetx} offsety {offsety}")
        svgString = header.format(x=width, y=height)

        # adding the svg based on z values
        while atomIdx < self.atom_no or bondIdx < self.bond_no:
            if atomIdx >= self.atom_no: #ran out of atoms
                if(nightmare):
                    bond = Bond(self.get_bond(bondIdx))
                    svgString += bond.svg2(bondIdx);
                else:
                    svgString += Bond(self.get_bond(bondIdx)).svg()
                bondIdx += 1
                continue
            elif bondIdx >= self.bond_no: #ran out of bonds
                svgString += Atom(self.get_atom(atomIdx)).svg()
                atomIdx += 1
                continue

            if self.get_atom(atomIdx).z < self.get_bond(bondIdx).z:
                svgString += Atom(self.get_atom(atomIdx)).svg()
                atomIdx += 1
            else:
                if(nightmare):
                    bond = Bond(self.get_bond(bondIdx))
                    svgString += bond.svg2(bondIdx);
                else:
                    svgString += Bond(self.get_bond(bondIdx)).svg()
                bondIdx += 1
        svgString += footer
        return svgString

    def parse(self,file):
        """
        parses a textiowrapper and imports an sdf file
        """
        #remove first 3 lines
        file.readline() #the header molecule name
        file.readline()
        file.readline()
        
        #read line, split by spaces
        stats = file.readline().split();
        numAtoms = int(stats[0]) #first number is number of atoms
        numBonds = int(stats[1]) #second number is number of bonds

        #read numAtoms lines and parse as atoms
        for n in range(numAtoms):
            atom = file.readline().split()
            self.append_atom(str(atom[3]), float(atom[0]), float(atom[1]), float(atom[2]))
        
        #read numBonds lines parse as bonds
        for n in range(numBonds):
            bond = file.readline().split()
            self.append_bond(int(bond[0])-1, int(bond[1])-1, (int)(bond[2]))
        file.close()

        
    def parseString(self,stringMol):
        """
        parses a textiowrapper and imports an sdf file
        """
        strPieces = stringMol.split('\n');
        counter = 3
        # print(next(itr))
        # print(next(itr))
        # print(next(itr))

        #remove first 3 lines
        # file.readline() #the header molecule name
        # file.readline()
        # file.readline()
        
        #read line, split by spaces
        stats = strPieces[counter].split();
        counter += 1
        print(stats)
        numAtoms = int(stats[0]) #first number is number of atoms
        numBonds = int(stats[1]) #second number is number of bonds
        print(f"""atoms: {numAtoms} bonds: {numBonds}""")

        #read numAtoms lines and parse as atoms
        for n in range(numAtoms):
            atom = strPieces[counter].split()
            counter+=1
            self.append_atom(str(atom[3]), float(atom[0]), float(atom[1]), float(atom[2]))
        
        #read numBonds lines parse as bonds
        for n in range(numBonds):
            bond = strPieces[counter].split()
            counter+=1
            self.append_bond(int(bond[0])-1, int(bond[1])-1, (int)(bond[2]))
class Rotation:
    def loadMol(self, mol):
        self.x = []
        self.y = []
        self.z = []
        mx = molecule.mx_wrapper(5,0,0);
        my = molecule.mx_wrapper(0,5,0);
        mz = molecule.mx_wrapper(0,0,5);
        for i in range(72):
            self.x.append(mol.svg(nightmare=True, rotation=True))
            mol.xform(mx.xform_matrix)
        for i in range(72):
            self.y.append(mol.svg(nightmare=True, rotation=True))
            mol.xform(my.xform_matrix)
        for i in range(72):
            self.z.append(mol.svg(nightmare=True, rotation=True))
            mol.xform(mz.xform_matrix)

    def getRotation(self, x, y, z):
        if x != 0:
            return self.x[x]
        if y != 0:
            return self.y[y]
        return self.z[z]



if __name__ == "__main__":
    mol = Molecule()
    
    mol.parse(open("caffine.sdf", "r"))
    print(mol)
    print(mol.svg())
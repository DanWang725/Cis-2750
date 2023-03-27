CC=clang
CFLAGS= -Wall -std=c99 -pedantic
PYPATH=/usr/include/python3.7m
PYLIB=/usr/lib/python3.7/config-3.7m-x86-linux-gnu/

export LD_LIBRARY_PATH=pwd

all: _molecule.so
libmol.so: mol.o
	$(CC) $(CFLAGS) mol.o -shared -o libmol.so
mol.o: mol.c mol.h
	$(CC) $(CFLAGS) -c mol.c -fPIC -o mol.o
molecule_wrap.c molecule.py: molecule.i
	swig3.0 -python molecule.i
molecule_wrap.o: molecule_wrap.c
	$(CC) $(CFLAGS) -c molecule_wrap.c -fPIC -I $(PYPATH) -o molecule_wrap.o
_molecule.so: molecule_wrap.o libmol.so
	$(CC) $(CFLAGS) molecule_wrap.o -shared -L. -Wl,-rpath=. -lmol -L $(PYLIB) -lpython3.7m -dynamiclib -o _molecule.so 
test1.o: test6.c mol.h
	$(CC) $(CFLAGS) -c test6.c -o test1.o
a.out: libmol.so test1.o
	$(CC) test1.o mol.o -Wl,-rpath=. -L. -o a.out -lm
runTarget: all
	./a.out
clean:
	rm -f *.o *.so *.out
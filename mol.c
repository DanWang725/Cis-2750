#define _USE_MATH_DEFINES
#include "mol.h"

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

#include <stddef.h>
#include <stdio.h>
#include <math.h>
#include <string.h>

/**
 * converts degrees to radians
 * @param deg
 * @return
 */
double degToRad(unsigned short deg){
	return deg * M_PI / 180;
}
/**
 * Finds the index given using pointers
 * @param start The start of the array
 * @param key The pointer to the element in the array
 * @param length The length of the array
 * @return -1 if not in array, the index otherwise
 */
short int getIndexAtAtomArray(atom* start, atom* key, short int length){
	if(start == NULL || key == NULL){
		return -1;
	}
	ptrdiff_t displacement = key - start;
	if(displacement >= length){
		return -1;
	}
	return (short int)displacement;
}
/**
 * Finds the index given using pointers
 * @param start The start of the array
 * @param key The pointer to the element in the array
 * @param length The length of the array
 * @return -1 if not in array, the index otherwise
 */
short int getIndexAtBondArray(bond* start, bond* key, short int length){
	if(start == NULL || key == NULL){
		return -1;
	}
	ptrdiff_t displacement = key - start;
	if(displacement >= length){
		return -1;
	}
	return (short int)displacement;
}

/**
 * Sets the atom with the given parameters
 * @param atom - the atom to set
 * @param element - a null terminated char array
 * @param x - the coordinates
 * @param y
 * @param z
 */
void atomset(atom *atom, char element[3], double *x, double *y, double *z){
	strcpy(atom->element, element);
	atom->x = *x;
	atom->y = *y;
	atom->z = *z;
}
/**
 * Gets the following data from an atom and outputs to pointers
 * @param atom
 * @param element
 * @param x
 * @param y
 * @param z
 */
void atomget(atom *atom, char element[3], double *x, double *y, double *z){
	for(int i = 0; i<3; i++){
		element[i] = atom->element[i];
	}

	*x = atom->x;
	*y = atom->y;
	*z = atom->z;
}
/**
 * Copies an atom data and sets it to a new atom
 * @param src the source atom
 * @param dest the atom to copy info into
 */
void atomcopy(atom* src, atom* dest){
	atomset(dest, src->element, &(src->x), &(src->y), &(src->z));
}
/**
 * Sets the bond to have the given information
 * @param bond the bond to write information into
 * @param a1
 * @param a2
 * @param epairs
 */
void bondset( bond *bond, unsigned short *a1, unsigned short *a2, atom **atoms, unsigned char *epairs)
{
	bond->a1 = *a1;
	bond->a2 = *a2;
	bond->atoms = *atoms;
	bond->epairs = *epairs;
	compute_coords(bond);
}
/**
 * gets the bond formation and writes it into pointer parameters
 * @param bond
 * @param a1
 * @param a2
 * @param epairs
 */
void bondget( bond *bond, unsigned short *a1, unsigned short *a2, atom **atoms, unsigned char *epairs)
{
	*a1 = bond->a1;
	*a2 = bond->a2;
	*epairs = bond->epairs;
	*atoms = bond->atoms;
}

atom* bondGetA1(bond* bond){
	return &(bond->atoms[bond->a1]);
}

atom* bondGetA2(bond* bond){
	return &(bond->atoms[bond->a2]);
}

/**
 * computes the calculations for variables in bond. Requires a1 and a2, and atoms to exits
*/
void compute_coords( bond *bond ){
	atom * a1 = &(bond->atoms[bond->a1]);
	atom * a2 = &(bond->atoms[bond->a2]);
	bond->x1 = a1->x;
	bond->y1 = a1->y;

	bond->x2 = a2->x;
	bond->y2 = a2->y;
	bond->z = (a1->z + a2->z)/2;
	bond->len = sqrt((a2->x - a1->x)*(a2->x - a1->x) + (a2->y - a1->y)*(a2->y - a1->y));
	bond->dx = (a2->x - a1->x) / bond->len;
	bond->dy = (a2->y - a1->y) / bond->len;
}

/**
 * mallocs a molecule structure and allocates space for bonds and pointers
 * @param atom_max the number of atoms to allocate for
 * @param bond_max the number of bonds to allocate for
 * @return a molecule pointer
 */
molecule *molmalloc(unsigned short atom_max, unsigned short bond_max)
{
	molecule* newMolcule = malloc(sizeof(molecule));
	newMolcule->atom_max = atom_max;
	newMolcule->atom_no = 0;
	if(atom_max <= 0){
		newMolcule->atoms = NULL;
		newMolcule->atom_ptrs = NULL;
	} else {
		newMolcule->atoms = malloc(sizeof(atom)*atom_max);
		newMolcule->atom_ptrs = malloc(sizeof(atom*)*atom_max);
	}

	newMolcule->bond_max = bond_max;
	newMolcule->bond_no = 0;

	if(bond_max <= 0){
		newMolcule->bonds = NULL;
		newMolcule->bond_ptrs = NULL;
	} else {
		newMolcule->bonds = malloc(sizeof(bond)*bond_max);
		newMolcule->bond_ptrs = malloc(sizeof(bond*)*bond_max);
	}
    return newMolcule;
}
/**
 * creates a copy of a molecule
 * @param src the molecule to copy
 * @return
 */
molecule *molcopy(molecule *src)
{
	if(src == NULL){
		fprintf(stderr, "molcopy: Error! cannot copy null molecule!\n");
		exit(0);
	}
    molecule* newMolecule = molmalloc(src->atom_max, src->bond_max);

	newMolecule->atom_no = src->atom_no;	//copying atom no and max
	newMolecule->atom_max = src->atom_max;
	for(int i = 0; i < newMolecule->atom_no; i++){ //copy atoms from src
		atom* refAtom = &(src->atoms[i]);
		
		atomcopy(refAtom, &(newMolecule->atoms[i])); 
	}

	for (int i = 0; i < newMolecule->atom_no; i++)	//copying atomptr
	{
		//finding the index of the atom that the atomptr is pointing to
		short int atomIndex = getIndexAtAtomArray(src->atoms, src->atom_ptrs[i], newMolecule->atom_no);
		if(atomIndex >= 0){
			newMolecule->atom_ptrs[i] = &(newMolecule->atoms[atomIndex]);	//pointing to atom in new molecule at corresponding index
		}
	}
	
	newMolecule->bond_no = src->bond_no;	//copy bond no and max
	newMolecule->bond_max = src->bond_max;
	for(int i = 0; i < newMolecule->bond_no; i++){	//copy bonds from src
		bond* refBond = &(src->bonds[i]);

		bondset(&(newMolecule->bonds[i]), &(refBond->a1), &(refBond->a2), &(newMolecule->atoms), &(refBond->epairs));
	}

	//copy order of bonds sorted
	for (int i = 0; i < newMolecule->bond_no; i++)
	{
		//finding corresponding bond location that ith bondptr points to
		short int bondIndex = getIndexAtBondArray(src->bonds, src->bond_ptrs[i], newMolecule->bond_no);
		//printf("We have bond starting %p, and %p at index [%d]\n", (void *)src->bonds, (void *)src->bond_ptrs[i], bondIndex);
		if(bondIndex != -1){
			//printf("reassigning bond ptr: %d at [%d]\n", i, bondIndex);
			newMolecule->bond_ptrs[i] = &(newMolecule->bonds[bondIndex]);
		}
	}
	return newMolecule;
}

/**
 * frees the molecule from memory
 * It will not free the atoms and bonds that were appended into the thing
*/
void molfree(molecule *ptr)
{
	free(ptr->atoms);
	free(ptr->atom_ptrs);

	free(ptr->bonds);
	free(ptr->bond_ptrs);
	free(ptr);
}
/**
 * appends an atom to a molecule
 * @param molecule
 * @param atom
 */
void molappend_atom(molecule *molecule, atom *atom)
{
	if(molecule == NULL){
		fprintf(stderr, "molappend_atom: Exception cannot add atom to null molecule\n");
		exit(0);
	}
	if(atom == NULL){
		fprintf(stderr, "molappend_atom: Exception cannot add null atom to molecule\n");
		exit(0);
	}
	struct atom* oldPosition = molecule->atoms;
	if(molecule->atom_no == molecule->atom_max){ //reallocating the atom array if full

		molecule->atom_max *= 2;
		if(molecule->atom_max == 0){
			molecule->atom_max += 1;
		}
		//verifying that both reallocs have worked
		if((molecule->atoms = realloc(molecule->atoms, sizeof(struct atom)*(molecule->atom_max))) == NULL){
			fprintf(stderr,"Error! Allocation failed! Could not reallocate for atom array of size %d", molecule->atom_max);
			exit(0);
		}
		if((molecule->atom_ptrs = realloc(molecule->atom_ptrs, sizeof(struct atom *) * molecule->atom_max)) == NULL){
			fprintf(stderr,"Error! Allocation failed! Could not reallocate for atom pointer of size %d", molecule->atom_max);
			exit(0);
		}
		//calculating difference in memory locations
		//ptrdiff_t diff = (molecule->atom_max == 1) ? 0 : molecule->atoms - oldPosition;

		//applying difference to atomptrs
		for(int i = 0; i < molecule->atom_no; i++){
			molecule->atom_ptrs[i] = &(molecule->atoms[molecule->atom_ptrs[i] - oldPosition]);
		}

		//applying difference to any atom in atom array to bonds
		for (int i = 0; i < molecule->bond_no; i++)
		{
			bond* refBond = &(molecule->bonds[i]);
			refBond->atoms = molecule->atoms;
		}
	}
	molecule->atoms[molecule->atom_no] = *atom;
	molecule->atom_ptrs[molecule->atom_no] = &(molecule->atoms[molecule->atom_no]);
	molecule->atom_no+= 1;
}
/**
 * Appends a bond to the molecule
*/
void molappend_bond(molecule *molecule, bond *bond)
{
	if(molecule == NULL){
		fprintf(stderr, "molappend_bond: Exception cannot add bond to null molecule\n");
		exit(0);
	}
	if(bond == NULL){
		fprintf(stderr, "molappend_bond: Exception cannot add null bond to molecule\n");
		exit(0);
	}

	if(molecule->bond_no == molecule->bond_max){ //reallocating the atom array if full
		struct bond* oldPosition = molecule->bonds;
		//printf("reallocating bonds\n");
		molecule->bond_max *= 2;
		if(molecule->bond_max == 0){
			molecule->bond_max += 1;
		}
		//verifying that both reallocs have worked
		if((molecule->bonds = realloc(molecule->bonds, sizeof(struct bond)*(molecule->bond_max))) == NULL){
			fprintf(stderr, "molappend_bond: Exception allocation failed!\n");
			exit(0);
		}
		if((molecule->bond_ptrs = realloc(molecule->bond_ptrs, sizeof(struct bond *) * molecule->bond_max)) == NULL){
			fprintf(stderr, "Error! Allocation failed! Could not reallocate for bond pointer of size %d", molecule->bond_max);
			exit(0);
		}

		//applying difference to atomptrs
		for(int i = 0; i < molecule->bond_no; i++){
			molecule->bond_ptrs[i] = &(molecule->bonds[molecule->bond_ptrs[i] - oldPosition]);
			//printf("We have bond starting %p, and %p at index [%d]\n", (void *)molecule->bonds, (void *)molecule->bond_ptrs[i], molecule->bond_ptrs[i] - oldPosition);

		}
	}

	molecule->bonds[molecule->bond_no] = *bond;
	molecule->bond_ptrs[molecule->bond_no] = &(molecule->bonds[molecule->bond_no]);
	molecule->bond_no++;
}
int signNum(double num){
	if(num > 0){
		return 1;
	} else if(num < 0){
		return -1;
	} else {
		return 0;
	}
}
int bond_comp(const void *a, const void *b){
	return signNum((*(bond**)a)->z - (*(bond**)b)->z);
}
int cmpfuncAtom(const void *a, const void *b){
	double result = (*(atom**)a)->z - (*(atom**)b)->z;
	return signNum(result);
}

void molsort(molecule *molecule)
{
	qsort(molecule->atom_ptrs, molecule->atom_no, sizeof(atom*), cmpfuncAtom);
	//printf("I AM SORTING PT1\n");
	qsort(molecule->bond_ptrs, molecule->bond_no, sizeof(bond*), bond_comp);
	//printf("I AM WORKING\n");
}
/**
 * generates a transform matrix for rotations around the x axis
 * @param xform_matrix
 * @param deg the degrees to rotate
 */
void xrotation(xform_matrix xform_matrix, unsigned short deg){
	xform_matrix[0][0] = 1;
	xform_matrix[0][1] = 0;
	xform_matrix[0][2] = 0;
	xform_matrix[1][0] = 0;
	xform_matrix[2][0] = 0;
	double _angleInRadians = degToRad(deg);
	double _cosAngle = cos(_angleInRadians);
	double _sinAngle = sin(_angleInRadians);

	xform_matrix[1][1] = _cosAngle;
	xform_matrix[2][2] = _cosAngle;
	xform_matrix[1][2] = -_sinAngle;
	xform_matrix[2][1] = _sinAngle;
}
/**
 * generates a transform matrix for rotation around the y axis.
 * @param xform_matrix
 * @param deg
 */
void yrotation(xform_matrix xform_matrix, unsigned short deg)
{
	xform_matrix[0][1] = 0;
	xform_matrix[1][1] = 1;
	xform_matrix[2][1] = 0;
	xform_matrix[1][0] = 0;
	xform_matrix[1][2] = 0;

	double _angleInRadians = degToRad(deg);
	double _cosAngle = cos(_angleInRadians);
	double _sinAngle = sin(_angleInRadians);

	xform_matrix[0][0] = _cosAngle;
	xform_matrix[2][2] = _cosAngle;
	xform_matrix[0][2] = _sinAngle;
	xform_matrix[2][0] = -_sinAngle;
}
/**
 * generates a transform matrix to rotate around the z axis
 * @param xform_matrix
 * @param deg
 */
void zrotation(xform_matrix xform_matrix, unsigned short deg)
{
	xform_matrix[2][2] = 1;
	xform_matrix[2][1] = 0;
	xform_matrix[2][0] = 0;
	xform_matrix[1][2] = 0;
	xform_matrix[0][2] = 0;
	double _angleInRadians = degToRad(deg);
	double _cosAngle = cos(_angleInRadians);
	double _sinAngle = sin(_angleInRadians);

	xform_matrix[0][0] = _cosAngle;
	xform_matrix[1][1] = _cosAngle;
	xform_matrix[0][1] = -_sinAngle;
	xform_matrix[1][0] = _sinAngle;
}
/**
 * A helper to apply a matrix multiplication to a coordinates
 * @param matrix
 * @param x
 * @param y
 * @param z
 */
void matrixMultiplication(xform_matrix matrix, double *x, double *y, double *z){
	double nX = *x;
	double nY = *y;
	double nZ = *z;
	*x = matrix[0][0]*nX + matrix[0][1]*nY + matrix[0][2]*nZ;
	*y = matrix[1][0]*nX + matrix[1][1]*nY + matrix[1][2]*nZ;
	*z = matrix[2][0]*nX + matrix[2][1]*nY + matrix[2][2]*nZ;
}

/**
 * Applies a transformation matrix to all atoms in a molecule
 * @param molecule the molecule to apply matrix transformation
 * @param matrix an xform_matrix of a transform
*/
void mol_xform(molecule *molecule, xform_matrix matrix)
{
	for (int i = 0; i < molecule->atom_no; i++){
		atom* refAtom = &(molecule->atoms[i]);
		matrixMultiplication(matrix, &(refAtom->x), &(refAtom->y), &(refAtom->z));
	}
	for(int i = 0; i<molecule->bond_no; i++){
		compute_coords(&(molecule->bonds[i]));
	}
	
}

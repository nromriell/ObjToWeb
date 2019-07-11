#main.py
import click
import json
import re
from collections import OrderedDict


def printError(errorMsg):
    print("Error: "+errorMsg+", Exiting...")

def formatText(lineArray):
    name = ""
    vertices = []
    normals = []
    faces = []
    faceNormals = []
    uvs = []
    for line in lineArray:
        if line[0] == "o":
            name = line.split()[1]
        elif line[0] == "v" and line[1] != "n":
            values = line.split()
            px = float(values[1])
            py = float(values[2])
            pz = float(values[3])
            vertex = [px,py,pz]
            vertices.extend(vertex)
        elif line[0] == "v" and line[1] == "n":
            values = line.split()
            nx = float(values[1])
            ny = float(values[2])
            nz = float(values[3])
            normal = [nx, ny, nz]
            normals.append(normal)
        elif line[0] == "f":
            values = line.split()
            fv1 = int(re.sub('\/\/\d*', '', values[1]))-1
            fv2 = int(re.sub('\/\/\d*', '', values[2]))-1
            fv3 = int(re.sub('\/\/\d*', '', values[3]))-1
            fvn1 = int(re.sub('\d*\/\/', '', values[1])) - 1
            fvn2 = int(re.sub('\d*\/\/', '', values[2])) - 1
            fvn3 = int(re.sub('\d*\/\/', '', values[3])) - 1
            faces.extend([fv1,fv2,fv3])
            faceNormals.extend([fvn1,fvn2, fvn3])
    #TODO: Fix Normals To Match Faces
    normalsCorrected = [None]*(len(faceNormals)*3)
    currentIndex = 0
    for i in range(len(faceNormals)):
        vn = normals[faceNormals[i]]
        normalsCorrected[currentIndex] = vn[0]
        normalsCorrected[currentIndex+1] = vn[1]
        normalsCorrected[currentIndex+2] = vn[2]
        currentIndex += 3
    mesh = OrderedDict([
        ("name",name),
        ("vertices",vertices),
        ("normals",normalsCorrected),
        ("tris", faces)
    ])
    return mesh

@click.command()
@click.option('--path', prompt='path', help='path to input file')
@click.option('--o', prompt='output', help='output path with file name - no extension')

def main(path, o):
    print("File Converter for Obj to WebGL Mesh path:{}".format(path))
    if len(path) == 0:
        printError("Empty Data Path")
        return
    if len(o) == 0:
        printError("Empty Output Path")
        return
    file_object = open(path, "r")
    if file_object:
        data = file_object.readlines()
        if len(data) == 0:
            printError("Empty File")
            return
        mesh = formatText(data)
        print("Vertice Length:" + str(len(mesh["vertices"])))
        print("Normal Length:" + str(len(mesh["normals"])))
        print("Tris Length:" + str(len(mesh["tris"])))
        jMesh = "const "+mesh["name"]+" = "+json.dumps(mesh, indent=4, sort_keys=False)+";\n\nexport default "+mesh["name"]+";"
        file_object.close()
        newFile = open(o+".js", "w")
        newFile.write(jMesh)
        newFile.close()
        print("Conversion Successful")
    else:
        printError("Invalid File")


if __name__ == "__main__":
    main()
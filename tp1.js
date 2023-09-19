var matbin=new Array;
var vecbin=[0,0];
matbin=[[0,0],[0,0]]; 
lecturaArch(matbin,vecbin);
console.log("matriz: ",matbin);
matProb(matbin);
console.log("matriz de probabilidades:",matbin);
if (isnula(matbin))
    console.log("entropia nula:",entropianula(matbin));
else
    console.log("entropia no nula:",entropiaNOnula(matbin));
function lecturaArch(matbin,vecbin) {
    const fs = require('fs');
    if (process.argv[2]!=undefined && fs.existsSync(process.argv[2])){
        const archivo = fs.openSync(process.argv[2], 'r');
        const buffer = Buffer.alloc(1);
        let bytesRead;
        let a=-1;
        while ((bytesRead = fs.readSync(archivo, buffer, 0, 1, null)) !== 0) {
            for (let i=7;i>=0;i--){
                    var b=(buffer[0]>>i)&1;
                    if (a!=-1)
                      matbin[b][a]++;
                    vecbin[b]++;
                  a=b;
            }
        }
        fs.closeSync(archivo);
    }
}
function matProb(matbin){
    let sum1=matbin[0][0]+matbin[1][0];
    let sum2=matbin[0][1]+matbin[1][1];
    if (sum1!=0){
        matbin[0][0]/=sum1;
        matbin[1][0]/=sum1;
    }
    if (sum2!=0){
        matbin[0][1]/=sum2;
        matbin[1][1]/=sum2;
    }
}
function isnula(matbin){
    if (Math.abs(matbin[0][0]-matbin[0][1])<=0.015 && (Math.abs(matbin[1][0]-matbin[1][1])<=0.015))
        return true;
    else
        return false;

}
function entropianula(matbin){
    var sum=0;
    for (let i=0;i<2;i++){
        for (let j=0;j<2;j++){
            if (matbin[i][j]!=0)
                sum+=matbin[i][j]*Math.log2(1/matbin[i][j]);
        }
    }
    if (process.argv[3]!=undefined)
        sum*=process.argv[3];
    return sum;
}
function entropiaNOnula(matbin){
    const math = require('mathjs');
    var a=[[matbin[0][0],matbin[0][1]],[1,1]];
    var b=[0,1];
    var sn=math.usolve(a,b);
    let aux=0,sum=0;
    for (let i=0;i<2;i++){
        for (let j=0;j<2;j++){
            if (matbin[j][i]!=0)
                aux+=matbin[j][i]*math.log2(1/matbin[j][i]);
        }
        aux*=sn[i];
        sum+=aux;
    }
    return sum;
}
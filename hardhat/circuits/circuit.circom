pragma circom 2.0.0;

include "../node_modules/circomlib-ml/circuits/Conv2D.circom";
include "../node_modules/circomlib-ml/circuits/Dense.circom";
include "../node_modules/circomlib-ml/circuits/ArgMax.circom";
include "../node_modules/circomlib-ml/circuits/Poly.circom";
include "../node_modules/circomlib-ml/circuits/AveragePooling2D.circom";
include "../node_modules/circomlib-ml/circuits/BatchNormalization2D.circom";
include "../node_modules/circomlib-ml/circuits/Flatten2D.circom";
include "../node_modules/circomlib/circuits/mimc.circom";

include "sha256/sha256.circom";
include "../node_modules/circomlib-ml/circuits/circomlib/bitify.circom";

template hashed_mnist_latest() {
    signal input in[797*8];
    // signal input in[28][28][1];
    signal input conv2d_1_weights[3][3][1][4];
    signal input conv2d_1_bias[4];
    signal input bn_1_a[4];
    signal input bn_1_b[4];
    signal input conv2d_2_weights[3][3][4][8];
    signal input conv2d_2_bias[8];
    signal input bn_2_a[8];
    signal input bn_2_b[8];
    signal input dense_weights[200][10];
    signal input dense_bias[10];
    signal output out;
    signal output hash;
    signal output digest[2];

    component sha = Sha256(797*8);
    component pixels[28][28][1];

    for (var i=0; i<797*8; i++) {
        sha.in[i] <== in[i];
    }

    for (var i=0; i<28; i++) {
        for (var j=0; j<28; j++) {
            pixels[i][j][0] = Bits2Num(8);
            for (var k=0; k<8; k++) {
                pixels[i][j][0].in[k] <== in[13*8+i*28*8+j*8+k]; // the pgm header is 13 bytes
            }
        }
    }

    component b2n[2];

    for (var i=1; i>=0; i--) {
        b2n[i] = Bits2Num(128);
        for (var j=127; j>=0; j--) {
            b2n[i].in[127-j] <== sha.out[i*128+j];
        }
        digest[i] <== b2n[i].out;
    }
    
    component mimc = MultiMiMC7(3*3*1*4+4+4+4+3*3*4*8+8+8+8+200*10+10, 91);
    
    mimc.k <== 0;

    var idx = 0;

    component conv2d_1 = Conv2D(28,28,1,4,3,1);
    component bn_1 = BatchNormalization2D(26,26,4);
    component poly_1[26][26][4];
    component avg2d_1 = AveragePooling2D(26,26,4,2,2,25);
    component conv2d_2 = Conv2D(13,13,4,8,3,1);
    component bn_2 = BatchNormalization2D(11,11,8);
    component poly_2[11][11][8];
    component avg2d_2 = AveragePooling2D(11,11,8,2,2,25);
    component flatten = Flatten2D(5,5,8);
    component dense = Dense(200,10);
    component argmax = ArgMax(10);

    for (var i=0; i<28; i++) {
        for (var j=0; j<28; j++) {
            conv2d_1.in[i][j][0] <== pixels[i][j][0].out;
        }
    }

    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            for (var m=0; m<4; m++) {
                conv2d_1.weights[i][j][0][m] <== conv2d_1_weights[i][j][0][m];
                mimc.in[idx] <== conv2d_1_weights[i][j][0][m];
                idx++;
            }
        }
    }
    
    for (var m=0; m<4; m++) {
        conv2d_1.bias[m] <== conv2d_1_bias[m];
        mimc.in[idx] <== conv2d_1_bias[m];
        idx++;
    }

    for (var k=0; k<4; k++) {
        bn_1.a[k] <== bn_1_a[k];
        mimc.in[idx] <== bn_1_a[k];
        idx++;
    }

    for (var k=0; k<4; k++) {
        bn_1.b[k] <== bn_1_b[k];
        mimc.in[idx] <== bn_1_b[k];
        idx++;
        for (var i=0; i<26; i++) {
            for (var j=0; j<26; j++) {
                bn_1.in[i][j][k] <== conv2d_1.out[i][j][k];
            }
        }
    }

    for (var i=0; i<26; i++) {
        for (var j=0; j<26; j++) {
            for (var k=0; k<4; k++) {
                poly_1[i][j][k] = Poly(10**6);
                poly_1[i][j][k].in <== bn_1.out[i][j][k];
                avg2d_1.in[i][j][k] <== poly_1[i][j][k].out;
            }
        }
    }

    for (var i=0; i<13; i++) {
        for (var j=0; j<13; j++) {
            for (var k=0; k<4; k++) {
                conv2d_2.in[i][j][k] <== avg2d_1.out[i][j][k];
            }
        }
    }

    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            for (var k=0; k<4; k++) {   
                for (var m=0; m<8; m++) {
                    conv2d_2.weights[i][j][k][m] <== conv2d_2_weights[i][j][k][m];
                    mimc.in[idx] <== conv2d_2_weights[i][j][k][m];
                    idx++;
                }
            }
        }
    }

    for (var m=0; m<8; m++) {
        conv2d_2.bias[m] <== conv2d_2_bias[m];
        mimc.in[idx] <== conv2d_2_bias[m];
        idx++;
    }

    for (var k=0; k<8; k++) {
        bn_2.a[k] <== bn_2_a[k];
        mimc.in[idx] <== bn_2_a[k];
        idx++;
    }

    for (var k=0; k<8; k++) {
        bn_2.b[k] <== bn_2_b[k];
        mimc.in[idx] <== bn_2_b[k];
        idx++;
        for (var i=0; i<11; i++) {
            for (var j=0; j<11; j++) {
                bn_2.in[i][j][k] <== conv2d_2.out[i][j][k];
            }
        }
    }

    for (var i=0; i<11; i++) {
        for (var j=0; j<11; j++) {
            for (var k=0; k<8; k++) {
                poly_2[i][j][k] = Poly(10**18);
                poly_2[i][j][k].in <== bn_2.out[i][j][k];
                avg2d_2.in[i][j][k] <== poly_2[i][j][k].out;
            }
        }
    }

    for (var i=0; i<5; i++) {
        for (var j=0; j<5; j++) {
            for (var k=0; k<8; k++) {
                flatten.in[i][j][k] <== avg2d_2.out[i][j][k];
            }
        }
    }

    for (var i=0; i<200; i++) {
        dense.in[i] <== flatten.out[i];
        for (var j=0; j<10; j++) {
            dense.weights[i][j] <== dense_weights[i][j];
            mimc.in[idx] <== dense_weights[i][j];
            idx++;
        }
    }

    for (var i=0; i<10; i++) {
        dense.bias[i] <== dense_bias[i];
        mimc.in[idx] <== dense_bias[i];
        idx++;
    }

    for (var i=0; i<10; i++) {
        argmax.in[i] <== dense.out[i];
    }

    out <== argmax.out;
    hash <== mimc.out;
}

component main = hashed_mnist_latest();
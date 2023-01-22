pragma circom 2.0.0;

include "../node_modules/circomlib-ml/circuits/circomlib-matrix/matElemSum.circom";

template Mean(n) {
    signal input in[n];
    signal output out;

    component sum = matElemSum(1, n);

    for (var i = 0; i < n; i++) {
        sum.a[0][i] <== in[i];
    }
    
    out <== sum.out \ n;
}

template MeanAndVariance(n) {
    signal input in[n];
    signal output mean;
    signal output variance;

    component meanComp = Mean(n);
    for (var i = 0; i < n; i++) {
        meanComp.in[i] <== in[i];
    }

    mean <== meanComp.out;

    component sum = matElemSum(1, n);

    signal tmp[n];

    for (var i = 0; i < n; i++) {
        tmp[i] <== in[i] - meanComp.out;
        sum.a[0][i] <== tmp[i] * tmp[i];
    }
    
    variance <== sum.out \ (n-1);
}
pragma circom 2.0.0;

template YieldProof() {
    // input privat (issuer tidak ingin revenue & expenses bocor)
    signal input revenue;   // dalam cents
    signal input expenses;  // dalam cents

    // output publik: yield bersih
    signal output yieldCents;

    // constraint konsistensi
    yieldCents <== revenue - expenses;
}

component main = YieldProof();
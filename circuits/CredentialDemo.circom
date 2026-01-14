pragma circom 2.0.0;

template CredentialDemo() {
    // Private input: credential claim (accredited flag)
    signal input accreditedFlag;

    // Public input: investor address (as field element)
    signal input investorAddress;

    // Output: valid (untuk logging, sebenarnya Groth16 hanya cek constraint)
    signal output isValid;

    // Constraint: accreditedFlag HARUS 1
    accreditedFlag === 1;

    // Output = accreditedFlag
    isValid <== accreditedFlag;
}

component main { public [ investorAddress ] } = CredentialDemo();

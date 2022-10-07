function nimSum(arr) {
    let NimSum = arr[0]; 
    for(i=1; i<rows; i++){
        NimSum = NimSum ^ arr[i];
    }
    return NimSum;
}
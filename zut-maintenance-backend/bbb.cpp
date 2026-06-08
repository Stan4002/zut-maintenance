#include <iostream>
using namespace std;


int main(){
    int l[5];
    l[4] = 10;
    for (int i = 3; i >= 0; i--) {
        l[i] = 3 * l[i+1];
        cout << l[i+1] << endl;
        
    }

    for (int i = 0; i <= 4; i++) {
        cout << l[i] << " ";
        
    }
    return 0;
}
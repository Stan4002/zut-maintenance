#include <iostream>
using namespace std;


int main() {
    int alpha[50];
    
    int sum = 0;



    for (int i = 0; i < 50; i++) {
        alpha[i] = -1; // initialize elements
        if (i == 25) {
            alpha[i] = 62;
        }

    }

    int tenth = alpha[10];
    for (int i = 0; i < 50; i++) {
        cout << alpha[i] << " "; // display elements

    }

    
    


    return 0;
}
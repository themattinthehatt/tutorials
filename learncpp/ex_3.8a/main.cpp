#include <iostream>
#include <bitset>

// Note that with std::bitset, our options correspond to bit numbers, not bit
// patterns
const int option0 = 0;
const int option1 = 1;
const int option2 = 2;
const int option3 = 3;
const int option4 = 4;
const int option5 = 5;
const int option6 = 6;
const int option7 = 7;

int main()
{
    std::bitset<8> bits(0); // we need 8 bits, start with bit pattern 0000 0000
    bits.set(option0);      // set bit 0 to 1  (0000 0001)
    bits.flip(option6);     // flip bit 6 to 1 (0100 0001)
    bits.reset(option6);    // set bit 6 to 0  (0000 0001)

    std::cout << "Bit 0 has value: " << bits.test(option0) << std::endl;
    std::cout << "Bit 6 has value: " << bits.test(option6) << std::endl;
    std::cout << "bits has value: " << bits << std::endl;
    std::cout << "bits has size: " << sizeof(bits) << std::endl;

    // Note that initialization is treated as binary, whereas bitset functions
    // use bit positions!

    return 0;
}

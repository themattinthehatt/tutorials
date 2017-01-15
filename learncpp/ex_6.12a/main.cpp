#include <iostream>
#include <string>

int main()
{
    std::string names[] {"Alex", "Betty", "Caroline", "Dave", "Emily", "Fred", "Greg", "Holly"};

    std::cout << "Please enter a name: " << std::endl;
    std::string user_input;
    std::cin >> user_input;

    bool found_name = false;
    for (auto &name : names)
    {
        if (name == user_input)
            found_name = true;
    }

    if (!found_name)
        std::cout << user_input << " was not found." << std::endl;
    else
        std::cout << user_input << " was found." << std::endl;

    return 0;
}

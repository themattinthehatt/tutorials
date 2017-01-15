#include <iostream>

class Base
{
private:
    int m_nValue;

public:
    Base(int nValue)
    {
        m_nValue = nValue;
    }

protected:
    void Identify() { std::cout << "I am a Base" << std::endl; }
    void PrintValue() { std::cout << m_nValue; }
};

class Derived : public Base
{
public:
    Derived(int nValue) : Base(nValue)
    {
    }

//    int getValue() { return m_nValue; }
    void Identify()
    {
        Base::Identify();
        std::cout << "I am a Derived" << std::endl;
    }
    using Base::PrintValue;

};

int main()
{

//    Base cBase(5);
//    cBase.Identify();

    Derived cDerived(7);
    cDerived.PrintValue();

    return 0;
}

#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <algorithm>
#include <string>
#include <sstream>
using namespace std;
struct element
{
    string name, category, description;
    int price;
    float rating;
};
int main(void)
{
    vector<element> v;
    element a = {"Pioneer AVH-2300NEX", "Car and Vehicle Electronics", "This receiver features a 7-inch touchscreen display, Bluetooth connectivity, and compatibility with both Android Auto and Apple CarPlay.", 350, 4.5};
    element b = {"Escort MAX360C", "Car and Vehicle Electronics", "This radar detector offers 360-degree detection and includes GPS technology for added accuracy. It also features a multi-colour OLED display and comes with a free app for added functionality.", 599, 4.6};
    element c = {"Garmin DriveSmart 55", "Car and Vehicle Electronics", "This GPS device features a 5.5-inch display, voice-activated navigation, and compatibility with Amazon Alexa. It also includes live traffic updates and alerts for upcoming speed changes.", 199, 4.4};
    element d = {"JL Audio JX500/1D", "Car and Vehicle Electronics", "This monoblock amplifier is designed to deliver high-quality sound to your car's subwoofer. It features a variable low-pass filter and adjustable bass boost for optimal customization.", 249, 4.8};
    v.push_back(a);
    v.push_back(b);
    v.push_back(c);
    v.push_back(d);
    string s;
    cin >> s;
    
    vector<element> result;
    for (auto &e : v)
    {
        if (e.name.find(s) != string::npos)
        {
            result.push_back(e);
        }
        if (e.category.find(s) != string::npos)
        {
            result.push_back(e);
        }
        if (e.description.find(s) != string::npos)
        {
            result.push_back(e);
        }
    }
    cout << result.size() << endl;
    for (auto &e : result)
    {
        cout << e.name << endl;
        cout << e.category << endl;
        cout << e.description << endl;
        cout << e.price << endl;
        cout << e.rating << endl;
    }
    return 0;
}
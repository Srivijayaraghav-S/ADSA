#include <iostream>
#include <vector>
#include <algorithm>
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <unistd.h>
#include <queue>
#include <sstream>
using namespace std;

const int MAXN = 1e5 + 5;
const int MAXM = 1e6 + 5;
const int MAXK = 5;

struct Product
{
    string name, category, description;
    int price, rating;
};

struct Node
{
    int val, idx;
    Node *l;
    Node *r;
    Node() {}
    Node(int val, int idx) : val(val), idx(idx), l(nullptr), r(nullptr) {}
};

struct Query
{
    string str;
    int id;
    Query() {}
    Query(string str, int id) : str(str), id(id) {}
};

struct SegmentTree
{
    int mn[MAXM], mx[MAXM];
    void build(int *a, int *b, int l, int r, int k)
    {
        if (l == r)
        {
            mn[k] = mx[k] = a[l];
            return;
        }
        int m = (l + r) >> 1;
        build(a, b, l, m, k << 1);
        build(a, b, m + 1, r, k << 1 | 1);
        mn[k] = min(mn[k << 1], mn[k << 1 | 1]);
        mx[k] = max(mx[k << 1], mx[k << 1 | 1]);
    }
    int query_min(int l, int r, int ql, int qr, int k)
    {
        if (ql <= l && qr >= r)
        {
            return mn[k];
        }
        int m = (l + r) >> 1;
        int res = INT_MAX;
        if (ql <= m)
        {
            res = min(res, query_min(l, m, ql, qr, k << 1));
        }
        if (qr > m)
        {
            res = min(res, query_min(m + 1, r, ql, qr, k << 1 | 1));
        }
        return res;
    }
    int query_max(int l, int r, int ql, int qr, int k)
    {
        if (ql <= l && qr >= r)
        {
            return mx[k];
        }
        int m = (l + r) >> 1;
        int res = INT_MIN;
        if (ql <= m)
        {
            res = max(res, query_max(l, m, ql, qr, k << 1));
        }
        if (qr > m)
        {
            res = max(res, query_max(m + 1, r, ql, qr, k << 1 | 1));
        }
        return res;
    }
};

class BTree
{
private:
    int t;
    Node *root;
    int sz;
    vector<Query> queries;
    vector<int> leaves[MAXN];
    int cnt[MAXK];
    int score[MAXN];

    void traverse(Node *node, int &cnt, priority_queue<pair<int, int>> &pq)
    {
        if (!node)
        {
            return;
        }
        for (int i = 0; i < node->idx; i++)
        {
            int idx = node->l->val + i;
            int s = score[idx];
            if (pq.size() < 10 || s > pq.top().first)
            {
                pq.push({s, idx});
                if (pq.size() > 10)
                {
                    pq.pop();
                }
            }
        }
        traverse(node->l, cnt, pq);
        traverse(node->r, cnt, pq);
    }

    int get_score(int idx, vector<string> &words)
    {
        int s = 0;
        for (int i = 0; i < MAXK - 2; i++)
        {
            cnt[i] = 0;
        }
        stringstream ss(queries[idx].str);
        string word;
        while (ss >> word)
        {
            for (int i = 0; i < MAXK - 2; i++)
            {
                if (word.find(words[i]) != string::npos)
                {
                    cnt[i]++;
                }
            }
        }
        for (int i = 0; i < MAXK - 2; i++)
        {
            if (cnt[i] > 0)
            {
                s += cnt[i] * 10;
            }
        }
        s += score[idx];
        return s;
    }

public:
    BTree(int t) : t(t), root(nullptr), sz(0) {}
    void insert(Product &product)
    {
        string s[MAXK];
        s[0] = product.name;
        s[1] = product.category;
        s[2] = product.description;
        stringstream ss;
        ss << product.price;
        s[3] = ss.str();
        ss.clear();
        ss << product.rating;
        s[4] = ss.str();
        int id = ++sz;
        for (int i = 0; i < MAXK - 2; i++)
        {
            queries.emplace_back(s[i], id);
        }
        leaves[id].resize(MAXK - 2);
        for (int i = 0; i < MAXK - 2; i++)
        {
            leaves[id][i] = queries.size() - MAXK + i;
        }
        score[id] = product.rating;
        Node *node = root;
        if (!node)
        {
            root = new Node(id, 0);
            return;
        }
        while (!node->l)
        {
            int idx = node->idx;
            int cur = node->val + idx;
            if (queries[cur].id == id)
            {
                node = node->r;
                continue;
            }
            vector<string> words[MAXK - 2];
            for (int i = 0; i < MAXK - 2; i++)
            {
                words[i] = split(queries[cur].str);
                cout << queries[cur].str << endl;
            }
            words[3].emplace_back(queries[cur].str);
            words[4].emplace_back(queries[cur].str);
            int lca = get_lca(words);
            int mn = segment_tree.query_min(0, queries.size() - 1, leaves[lca][0], leaves[lca].back(), 1);
            int mx = segment_tree.query_max(0, queries.size() - 1, leaves[lca][0], leaves[lca].back(), 1);
            if (mx < mn || mx < cur)
            {
                node = node->r;
            }
            else if (mn > cur)
            {
                node = node->l;
            }
            else
            {
                node->l = new Node(mn, leaves[lca].front());
                node->r = new Node(mx, leaves[lca].back());
                break;
            }
        }
        if (!node->l)
        {
            node->l = new Node(id, queries.size() - MAXK);
            node->r = new Node(id, queries.size() - 1);
        }
        else
        {
            node->val = id;
            node->idx = -1;
        }
        node = node->parent;
        while (node)
        {
            update(node);
            node = node->parent;
        }
    }

    vector<Product> search(string query, double min_price, double max_price, double min_rating, double max_rating)
    {
        vector<string> words = split(query);
        for (int i = 0; i < MAXK - 2; i++)
        {
            cnt[i] = 0;
        }
        for (int i = 0; i < MAXK - 2; i++)
        {
            for (int j = 0; j < words.size(); j++)
            {
                if (words[j].find(words[i]) != string::npos)
                {
                    cnt[i]++;
                }
            }
        }
        vector<pair<int, int>> res;
        pq = priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>();
        traverse(root, cnt, pq);
        vector<int> ids;
        while (!pq.empty())
        {
            ids.emplace_back(pq.top().second);
            pq.pop();
        }
        sort(ids.begin(), ids.end());
        vector<Product> products;
        for (int i = 0; i < ids.size(); i++)
        {
            int id = ids[i];
            Product &product = products.emplace_back(name[id], category[id], description[id], price[id], rating[id]);
            if (product.price < min_price || product.price > max_price || product.rating < min_rating || product.rating > max_rating)
            {
                products.pop_back();
            }
        }
        return products;
    }
};

int main()
{
    BTree btree(4);
    btree.insert(Product("Product 1", "Category 1", "Description 1", 10.0, 4.5));
    btree.insert(Product("Product 2", "Category 2", "Description 2", 20.0, 4.0));
    btree.insert(Product("Product 3", "Category 3", "Description 3", 30.0, 3.5));
    btree.insert(Product("Product 4", "Category 1", "Description 4", 40.0, 3.0));
    btree.insert(Product("Product 5", "Category 2", "Description 5", 50.0, 2.5));
    vector<Product> products = btree.search("product 2", 0.0, 100.0, 0.0, 5.0);
    for (int i = 0; i < products.size(); i++)
    {
        cout << products[i].name << " " << products[i].category << " " << products[i].description << " " << products[i].price << " " << products[i].rating << endl;
    }
    return 0;
}

/*
Expected output:
Product 2 Category 2 Description 2 20 4
*/

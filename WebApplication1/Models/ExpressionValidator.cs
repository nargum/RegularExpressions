using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.Tokens;

namespace WebApplication1.Models
{
    class ExpressionValidator
    {
        private char currentCharacter;
        private Token currentToken;
        private int counter = -1;
        private string expression;
        private bool isFalseExpression = false;

        public ExpressionValidator(string expression)
        {
            this.expression = expression + "?";
        }

        public string getExpression()
        {
            string returnExpression = expression.Remove(expression.Length - 1, 1);
            return returnExpression;
        }

        public TreeNode<string> parse()
        {
            currentCharacter = nextCharacter();
            currentToken = nextToken();

            TreeNode<string> nodeS = parseS();

            if (isFalseExpression)
            {
                return null;
            }

            return nodeS;
        }

        private TreeNode<string> parseS()
        {
            TreeNode<string> nodeS = parseE();
            if (currentToken.getName() != "TEof_")
            {
                error();
                return null;
            }
            return nodeS;
        }

        private TreeNode<string> parseE()
        {
            TreeNode<string> nodeT = parseT();
            TreeNode<string> nodeG = parseG();

            if (nodeG != null)
            {
                nodeG.AddLeftChild(nodeT);
                return nodeG;
            }

            return nodeT;
        }

        private TreeNode<string> parseT()
        {
            TreeNode<string> nodeF = parseF();
            TreeNode<string> nodeU = parseU();

            if (nodeU != null)
            {
                nodeU.AddLeftChild(nodeF);
                return nodeU;
            }

            return nodeF;
        }

        private TreeNode<string> parseG()
        {
            if (currentToken.getName() == "TPlus_")
            {
                TreeNode<string> node = new TreeNode<string>(currentToken.getValue());
                currentToken = nextToken();
                TreeNode<string> nodeT = parseT();
                TreeNode<string> nodeG = parseG();

                if (nodeG != null)
                {
                    nodeG.AddLeftChild(nodeT);
                    node.AddRightChild(nodeG);
                    return node;
                }

                node.AddRightChild(nodeT);

                return node;


            }
            return null;
        }

        private TreeNode<string> parseF()
        {
            TreeNode<string> nodeX = parseX();
            TreeNode<string> nodeH = parseH(nodeX);

            if (nodeH == null)
            {
                return nodeX;
            }

            return nodeH;
        }

        private TreeNode<string> parseU()
        {
            if (currentToken.getName() == "TDot_")
            {
                TreeNode<string> node = new TreeNode<string>(currentToken.getValue());
                currentToken = nextToken();
                TreeNode<string> nodeF = parseF();
                TreeNode<string> nodeU = parseU();

                if (nodeU != null)
                {
                    nodeU.AddLeftChild(nodeF);
                    node.AddRightChild(nodeU);
                    return node;
                }

                node.AddRightChild(nodeF);
                return node;

            }
            else if (currentToken.getName() == "TLParen_" || currentToken.getName() == "TIdent_" || currentToken.getName() == "TEmptySet_" || currentToken.getName() == "TEps_")
            {
                TreeNode<string> node = new TreeNode<string>(".");
                TreeNode<string> nodeF = parseF();
                TreeNode<string> nodeU = parseU();

                if (nodeU != null)
                {
                    nodeU.AddLeftChild(nodeF);
                    node.AddRightChild(nodeU);
                    return node;
                }

                node.AddRightChild(nodeF);
                return node;
            }
            return null;

        }

        private TreeNode<string> parseX()
        {
            TreeNode<string> node = new TreeNode<string>();
            switch (currentToken.getName())
            {
                case "TIdent_":
                    node.SetData(currentToken.getValue());
                    currentToken = nextToken();
                    return node;
                case "TLParen_":
                    currentToken = nextToken();
                    node = parseE();
                    if (currentToken.getName() != "TRParen_")
                    {
                        error();
                        return null;
                    }
                    currentToken = nextToken();
                    return node;
                case "TEmptySet_":
                    node.SetData(currentToken.getValue());
                    currentToken = nextToken();
                    return node;
                case "TEps_":
                    node.SetData(currentToken.getValue());
                    currentToken = nextToken();
                    return node;
                default:
                    error();
                    return null;
            }
        }

        private TreeNode<string> parseH(TreeNode<string> nodeX)
        {
            TreeNode<string> root = null;
            if (currentToken.getName() == "TStar_")
            {
                root = new TreeNode<string>(currentToken.getValue());
                currentToken = nextToken();
                int starCounter = 0;

                while (currentToken.getName() == "TStar_")
                {
                    starCounter++;
                    currentToken = nextToken();
                }

                if (starCounter > 0)
                {
                    TreeNode<string>[] node = new TreeNode<string>[starCounter];
                    for (int i = 0; i < node.Length; i++)
                    {
                        node[i] = new TreeNode<string>("*");
                    }
                    node[starCounter - 1].AddLeftChild(nodeX);

                    for (int i = starCounter - 1; i > 0; i--)
                    {
                        node[i - 1].AddLeftChild(node[i]);
                    }

                    root.AddLeftChild(node[0]);
                }
                else
                {
                    root.AddLeftChild(nodeX);
                }

            }
            return root;
        }

        private char nextCharacter()
        {
            try
            {
                counter++;
                return expression[counter];
            }
            catch (IndexOutOfRangeException)
            {
                return '-';
            }

        }


        private Token nextToken()
        {
            while (currentCharacter == ' ' || currentCharacter == '\t')
            {
                currentCharacter = nextCharacter();
            }

            if (currentCharacter == '?')
            {
                return new TEof();
            }
            else
            {
                switch (currentCharacter)
                {
                    case '(':
                        currentCharacter = nextCharacter();
                        return new TLParen();
                    case ')':
                        currentCharacter = nextCharacter();
                        return new TRParen();
                    case '*':
                        currentCharacter = nextCharacter();
                        return new TStar();
                    case '.':
                        currentCharacter = nextCharacter();
                        return new TDot();
                    case '+':
                        currentCharacter = nextCharacter();
                        return new TPlus();
                    case '#':
                        currentCharacter = nextCharacter();
                        return new TEmptySet();
                    case 'ε':
                        currentCharacter = nextCharacter();
                        return new TEps();
                    default:
                        if (isValidCharacter(currentCharacter))
                        {
                            char c = currentCharacter;
                            currentCharacter = nextCharacter();
                            return new TIdent(c.ToString());
                        }
                        else
                        {
                            error();
                            return new TEof();
                        }

                }
            }
        }

        private bool isValidCharacter(char c)
        {
            if (((int)c >= 48 && (int)c <= 57) || ((int)c >= 97 && (int)c <= 122))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private void error()
        {
            if (isFalseExpression == false)
            {
                isFalseExpression = true;

                Console.WriteLine("False expression");
            }

        }

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    abstract class Token
    {
        private string value;

        public Token(string value)
        {
            this.value = value;
        }

        public string getValue()
        {
            return value;
        }

        public abstract string getName();

    }
}
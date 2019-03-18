using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TLParen : Token
    {
        public TLParen() : base("(")
        {

        }

        public override string getName()
        {
            return "TLParen_";
        }
    }
}
<%@ Page Title="About" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="WebApplication1.About" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    
    <h1>Hello world</h1>
    <canvas id ="canvas"></canvas>
    <script src="Scripts/canvas.js"></script>
    <button type="button" runat="server" onclick="clearCanvas()">Clear canvas</button>
    <button type="button" runat="server" onclick="addNewState()">Add new states</button>
    <button type="button" runat="server" onclick="move()">Move</button>
    <button type="button" runat="server" onclick="arrow()">draw arrow</button>
    <button type="button" runat="server" onclick="arc()">draw arc</button>
    <asp:Button ID="Test" runat="server" Text="Button" OnClick="btn_onclick" />
</asp:Content>

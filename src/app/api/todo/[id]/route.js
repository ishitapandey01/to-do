import DBConnection from "@/app/lib/Db";
import UserModel from "@/app/models/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await DBConnection();
        const todo = await UserModel.findById(params.id);
        if (!todo) {
            return NextResponse.json(
                { success: false, message: "Todo not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, todo }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { title, desc } = await request.json();
        await DBConnection();
        const updatedTodo = await UserModel.findByIdAndUpdate(
            params.id,
            { title, desc },
            { new: true }
        );
        if (!updatedTodo) {
            return NextResponse.json(
                { success: false, message: "Todo not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: "Todo updated successfully", updatedTodo },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await DBConnection();
        const deleted

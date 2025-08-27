import DBConnection from "@/app/lib/Db";
import UserModel from "@/app/models/user";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await DBConnection();
        const todo = await UserModel.findById(params.id);
        if (!todo) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
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
        const { title, desc, status } = await request.json();
        await DBConnection();
        
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (desc !== undefined) updateData.desc = desc;
        if (status !== undefined) updateData.status = status;
        
        const updatedTodo = await UserModel.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        );
        
        if (!updatedTodo) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: "Task updated successfully", todo: updatedTodo },
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
        const deletedTodo = await UserModel.findByIdAndDelete(params.id);
        
        if (!deletedTodo) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { success: true, message: "Task deleted successfully" },
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